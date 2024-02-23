class Tokens {
  static characterRepository = Symbol.for("repository.character");
  static characterLocalDataSource = Symbol.for("localDataSource.character");
  static characterRemoteDataSource = Symbol.for("remoteDataSource.character");
  static getSavedSelectedCharacters = Symbol.for("usecase.getSavedSelectedCharacters");
  static saveSelectedCharacters = Symbol.for("usecase.saveSelectedCharacters");
  static searchCharacter = Symbol.for("usecase.searchCharacter");
  static logger = Symbol.for("core.logger");
  static apolloClient = Symbol.for("external.apolloClient");
  static logLevel = Symbol.for("external.logLevel");
}

export default Tokens;
