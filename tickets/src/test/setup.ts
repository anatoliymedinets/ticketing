import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

import { app } from '../app'

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[]
    }
  }
}

jest.mock('../nats-wrapper')

process.env.NODE_ENV = 'test' // jest don't set by default NODE_ENV 'test'
let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'test_key'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin = () => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  }

  // Create a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token }

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // return a string thats an cookie with the encoded data
  return [`express:sess=${base64}`]
}