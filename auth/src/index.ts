import express from 'express';
require('express-async-errors');
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session'

import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error';

import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { currentUserRouter } from './routes/current-user';

const app = express();
app.set('trust proxy', true)

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true
  })
)

app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);

app.all('*', async () => {
  throw new NotFoundError('Route not found');
})

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })

    app.listen(3000, () => {
      console.log('Auth service listening on port 3000');
    });
  } catch (err) {
    console.error(err)
  }
}

start()

