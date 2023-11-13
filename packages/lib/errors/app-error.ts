/**
 * Generic application error codes.
 */
export enum AppErrorCode {
  'ALREADY_EXISTS' = 'AlreadyExists',
  'EXPIRED_CODE' = 'ExpiredCode',
  'INVALID_BODY' = 'InvalidBody',
  'INVALID_REQUEST' = 'InvalidRequest',
  'NOT_FOUND' = 'NotFound',
  'NOT_SETUP' = 'NotSetup',
  'UNAUTHORIZED' = 'Unauthorized',
  'UNKNOWN_ERROR' = 'UnknownError',
  'RETRY_EXCEPTION' = 'RetryException',
  'SCHEMA_FAILED' = 'SchemaFailed',
  'TOO_MANY_REQUESTS' = 'TooManyRequests',
}

export class AppError extends Error {
  /**
   * The error code.
   */
  code: string;

  /**
   * An error message which can be displayed to the user.
   */
  userMessage?: string;

  /**
   * Create a new AppError.
   *
   * @param errorCode A string representing the error code.
   * @param message An internal error message.
   * @param userMessage A error message which can be displayed to the user.
   */
  public constructor(errorCode: string, message?: string, userMessage?: string) {
    super(message || errorCode);
    this.code = errorCode;
    this.userMessage = userMessage;
  }

  /**
   * Parse an unknown value into an AppError.
   *
   * @param error An unknown type.
   */
  static parseError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError('UnknownError', error.message, undefined);
    }

    // Todo: Handle Prisma errors.

    // Todo: Handle TRPC errors.

    // Handle completely unknown errors.
    const { code, message, userMessage } = error as {
      code: unknown;
      message: unknown;
      status: unknown;
      userMessage: unknown;
    };

    let validCode: string | null = typeof code === 'string' ? code : null;
    let validMessage: string | undefined = typeof message === 'string' ? message : undefined;
    let validUserMessage: string | undefined =
      typeof userMessage === 'string' ? userMessage : undefined;

    if (!validCode) {
      return new AppError('UnknownError', validMessage, validUserMessage);
    }

    return new AppError(validCode, validMessage, validUserMessage);
  }
}
