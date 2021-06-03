import request from 'supertest'

import { app } from '../../app'

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: 1
    })
}

it('can fetch a list of tickets', async () => {
  await Promise.all([
    createTicket(),
    createTicket(),
    createTicket()
  ])
  const tickets = await request(app)
    .get(`/api/tickets`)
    .send()
    .expect(200)

  expect(tickets.body.length).toEqual(3)
})