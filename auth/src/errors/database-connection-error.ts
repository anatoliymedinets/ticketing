import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode: number = 500;
  reason: string = 'Error connectiong to database';

  constructor() {
    super('Error connecting to db');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [
      { message: this.reason }
    ]
  }
}