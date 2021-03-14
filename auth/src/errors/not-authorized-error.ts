import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode: number = 401;

  constructor(message?: string) {
    super(message || 'Not Authorized');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serializeErrors() {
    return [
      { message: this.message }
    ]
  }
}