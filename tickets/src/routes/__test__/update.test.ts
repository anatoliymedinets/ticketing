import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper'

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})

  expect(response.status).not.toEqual(401)
})

it('return a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'update',
      price: 20
    })
    .expect(404)
})

it('return a 401 if the user is not authentication', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'update',
      price: 20
    })
    .expect(401)
})

it('return a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'new',
      price: 20
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'update',
      price: 15
    })
    .expect(401)
})

it('return a 400 if the user provides an invalid title or price', async () => {
  const currentUserCookie = global.signin()

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', currentUserCookie)
    .send({
      title: 'new',
      price: 20
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', currentUserCookie)
    .send({
      title: '',
      price: 15
    })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', currentUserCookie)
    .send({
      title: 'update',
      price: -1
    })
    .expect(400)
})

it('updates the ticket provided valid inputs', async () => {
  const currentUserCookie = global.signin()

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', currentUserCookie)
    .send({
      title: 'new',
      price: 20
    })

  const title = 'update';
  const price = 15;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', currentUserCookie)
    .send({ title, price })
    .expect(200)

  const updatedTicket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

  expect(updatedTicket.body.title).toEqual(title)
  expect(updatedTicket.body.price).toEqual(price)
})

it('publishes an event', async () => {
  const currentUserCookie = global.signin()

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', currentUserCookie)
    .send({
      title: 'new',
      price: 20
    })

  const title = 'update';
  const price = 15;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', currentUserCookie)
    .send({ title, price })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})