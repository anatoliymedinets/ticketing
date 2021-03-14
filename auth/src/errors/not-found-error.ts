import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode: number = 404;

  constructor(message?: string) {
    super(message || 'Not found');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors() {
    return [
      { message: this.message }
    ]
  }
}