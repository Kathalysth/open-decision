export type CommonErrors = "GENERIC_ERROR";

export type ProgrammerErrors =
  | "MISSING_CONTEXT_PROVIDER"
  | "TRIED_VERIFY_UNAUTHENTICATED_USER_LOGIN"
  | "MISSING_ENV_VARIABLE"
  | "UNAUTHENTICATED_API_CALL"
  | "MISSING_URL_PARTS";

export type InterpreterErrors =
  | "INVALID_TREE"
  | "MISSING_STARTNODE"
  | "NO_CURRENT_NODE";

export type BuilderErrors =
  | "AUTH_VALIDATION_FAILED"
  | "WEBSOCKET_CONNECTION_FAILED";

export enum APIErrors {
  NOT_FOUND = 404,
  NO_TREE_DATA = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
  EMAIL_ALREADY_USED = 400,
  INCORRECT_EMAIL_OR_PASSWORD = 401,
  UNAUTHENTICATED = 401,
  PASSWORD_RESET_FAILED = 401,
  EMAIL_VERIFICATION_FAILED = 401,
  USER_NOT_FOUND = 404,
  EMAIL_NOT_WHITELISTED = 403,
  INVALID_DATA = 400,
  WHITELIST_ENTRY_COULD_NOT_BE_CREATED = 400,
  WHITELIST_ENTRY_COULD_NOT_BE_DELETED = 400,
  VALIDATION_ERROR = 400,
}

export type ErrorCodes =
  | CommonErrors
  | ProgrammerErrors
  | `INTERPRETER_${InterpreterErrors}`
  | `BUILDER_${BuilderErrors}`
  | `API_${keyof typeof APIErrors}`;
