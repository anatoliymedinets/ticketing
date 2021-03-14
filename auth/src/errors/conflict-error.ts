import { CustomError } from './custom-error';

export class ConflictError extends CustomError {
  statusCode: number = 409;

  constructor(message?: string) {
    super(message || 'Conflict');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, ConflictError.prototype)
  }

  serializeErrors() {
    return [
      { message: this.message }
    ]
  }
}