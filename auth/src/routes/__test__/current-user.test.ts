import request from 'supertest'
import { app } from '../../app'
import { signin } from '../../test/signin-helper'

// it('response with details about the current user', async () => {
//   const signupResponse = await request(app)
//     .post('/api/users/signup')
//     .send({
//       email: 'test@test.com',
//       password: 'password'
//     })
//     .expect(201)

//   console.log(signupResponse.get('Set-Cookie'))

//   const response = await request(app)
//     .get('/api/users/currentuser')
//     .set('Cookie', signupResponse.get('Set-Cookie'))
//     .send()
//     .expect(200)

//   expect(response.body.currentUser.email).toEqual('test@test.com')
// })

it('response with details about the current user', async () => {
  const cookie = await signin()

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200)

  expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('response with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)

  expect(response.body.currentUser).toBeNull()
})
