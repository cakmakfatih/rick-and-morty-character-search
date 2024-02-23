export const NON_LATIN_CHARACTERS_ERR_MSG = "Please use latin characters only.";

class Failure {
  error?: Error;
  message?: string;

  constructor(param?: Error | string) {
    if (param instanceof Error) {
      this.message = param.message;
      this.error = param;
    } else {
      this.message = param;
    }
  }
}

class UnexpectedFailure extends Failure {
  constructor(param: any) {
    super(param);
  }
}

class ApolloFailure extends Failure {
  constructor(param: Error | string) {
    super(param);
  }
}

class FormatFailure extends Failure {
  constructor(param: Error | string) {
    super(param);
  }
}

class LocalStorageFailure extends Failure {
  constructor(param: Error | string) {
    super(param);
  }
}

export {
  Failure,
  UnexpectedFailure,
  ApolloFailure,
  FormatFailure,
  LocalStorageFailure,
};
