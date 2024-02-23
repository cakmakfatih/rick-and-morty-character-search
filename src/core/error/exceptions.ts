class Exception extends Error {
  constructor(...args: any) {
    super(...args);
  }
}

class ApolloException extends Exception {
  constructor(...args) {
    super(...args);
  }
}

class LocalStorageException extends Exception {
  constructor(...args) {
    super(...args);
  }
}

export {
  Exception,
  ApolloException,
  LocalStorageException,
};
