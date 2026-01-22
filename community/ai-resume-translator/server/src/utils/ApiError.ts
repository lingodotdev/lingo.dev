class ApiError extends Error {
  public statusCode: number;
  public message: string;
  private traceStack?: string;
  public errors?: any[];
  public readonly success: boolean;

  constructor(
    statusCode: number = 500,
    message: string = "Internal Server Error",
    traceStack?: string,
    errors?: any[],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;

    if (traceStack) {
      this.traceStack = traceStack;
    } else {
      Error.captureStackTrace(this, this.constructor);
      this.traceStack = this.stack;
    }

    if (errors) {
      this.errors = errors;
    }
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
    };
  }

  getTraceStack() {
    return this.traceStack;
  }
}

export default ApiError;
