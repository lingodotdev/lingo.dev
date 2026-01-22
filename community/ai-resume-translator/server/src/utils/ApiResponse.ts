class ApiResponse {
  public statusCode: number;
  public message: string;
  public data: object;
  public extra: any;

  constructor(
    statusCode: number = 200,
    message: string = "Success",
    data: object = {},
    ...extra: any
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.extra = extra;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      ...this.extra,
    };
  }
}

export default ApiResponse;
