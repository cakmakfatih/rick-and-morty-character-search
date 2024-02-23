import { stubInterface } from "ts-sinon";
import Logger from "../../../../../core/Logger";
import CharacterLocalDataSource from "../../../../../features/character/data/datasources/CharacterLocalDataSource";
import CharacterRemoteDataSource from "../../../../../features/character/data/datasources/CharacterRemoteDataSource";
import CharacterRepositoryImpl from "../../../../../features/character/data/repositories/CharacterRepositoryImpl";
import { deepEqual, equal, ok } from "assert";
import { Left, Right } from "@typed-f/either";
import { ApolloException, LocalStorageException } from "../../../../../core/error/exceptions";
import { ApolloFailure, FormatFailure, LocalStorageFailure, NON_LATIN_CHARACTERS_ERR_MSG, UnexpectedFailure } from "../../../../../core/error/failures";
import Character from "../../../../../features/character/data/models/Character";

const mockLogger = stubInterface<Logger>();
const mockLocalDataSource = stubInterface<CharacterLocalDataSource>();
const mockRemoteDataSource = stubInterface<CharacterRemoteDataSource>();

const repository = new CharacterRepositoryImpl(mockLogger, mockLocalDataSource, mockRemoteDataSource);

describe("CharacterRepository", () => {
  describe("search", () => {
    const params = {
      page: 1,
      name: "Rick",
    };
    const mockRemoteResult = {
      characters: {
        info: {
          count: 1,
        },
        results: [],
      },
    };

    beforeEach(() => {
      mockLogger.info.resetHistory();
      mockLogger.debug.resetHistory();
      mockLogger.error.resetHistory();
      mockLogger.warn.resetHistory();
      mockRemoteDataSource.search.resetHistory();
    });

    it("should call [Logger.info] correctly", async () => {
      // arrange
      mockRemoteDataSource.search.resolves(mockRemoteResult);

      // act
      await repository.search(params);

      // assert
      ok(mockLogger.info.calledWith("[CharacterRepository.search] started."));
      ok(mockLogger.info.calledWith("[CharacterRepository.search] finished."));
      equal(mockLogger.info.callCount, 2);
    });

    it("should call [remoteDataSource.search] with correct params", async () => {
      // arrange
      mockRemoteDataSource.search.resolves(mockRemoteResult);

      // act
      await repository.search(params);

      // assert
      ok(mockRemoteDataSource.search.calledOnceWith(params));
    });

    it("should return [Right(result)] that is returned from [remoteDataSource.search]", async () => {
      // arrange
      mockRemoteDataSource.search.resolves(mockRemoteResult);

      // act
      const result = await repository.search(params);

      // assert
      deepEqual(result, new Right(mockRemoteResult));
    });

    it("should return [Left(ApolloFailure)] with correct message if [ApolloException] occurs.", async () => {
      // arrange
      const apolloException = new ApolloException("apollo-exception");
      mockRemoteDataSource.search.rejects(apolloException);
      const expectedFailure = new ApolloFailure(apolloException);

      // act
      const result = await repository.search(params);

      // assert
      ok(mockLogger.warn.calledOnceWith("[CharacterRepository.search] failed."));
      deepEqual(result, new Left(expectedFailure));
    });

    it("should return Left[(UnexpectedFailure)] if an unknown error occurs", async () => {
      // arrange
      const unexpectedException = new Error("apollo-exception");
      mockRemoteDataSource.search.rejects(unexpectedException);
      const expectedFailure = new UnexpectedFailure(unexpectedException);

      // act
      const result = await repository.search(params);

      // assert
      ok(mockLogger.warn.calledOnceWith("[CharacterRepository.search] failed unexpectedly."));
      deepEqual(result, new Left(expectedFailure));
    });

    it("should return [Left(FormatFailure)] if the given string has non-latin characters.", async () => {
      // arrange
      const failingParams = {
        page: 1,
        name: "ΔΔΔ",
      };
      const expectedFailure = new FormatFailure(NON_LATIN_CHARACTERS_ERR_MSG);

      // act
      const result = await repository.search(failingParams);

      // assert
      ok(mockLogger.warn.calledOnceWith("[CharacterRepository.search] failed."));
      deepEqual(result, new Left(expectedFailure));
    });

    it("should not pass multiple whitespaces to [remoteDataSource] if input contains multiple whitespaces", async () => {
      // arrange
      const multipleWhiteSpaceParams = {
        page: 1,
        name: "    name w i  t h multiple wh  itespace         ",
      };

      // act
      await repository.search(multipleWhiteSpaceParams);

      // assert
      ok(mockRemoteDataSource.search.calledOnceWith({
        page: 1,
        name: "name w i t h multiple wh itespace",
      }));
    });
  });

  describe("saveSelectedCharacters", () => {
    const params: Character[] = [
      {
        id: "1",
        name: "Rick",
        image: "url",
        episode: [
          {
            "id": "1",
          },
        ],
      }
    ];

    beforeEach(() => {
      mockLogger.info.resetHistory();
      mockLogger.debug.resetHistory();
      mockLogger.error.resetHistory();
      mockLogger.warn.resetHistory();
      mockLocalDataSource.saveSelectedCharacters.resetHistory();
    });

    it("should call [Logger.info] correctly", () => {
      // arrange
      mockLocalDataSource.saveSelectedCharacters.returns();

      // act
      repository.saveSelectedCharacters(params);

      // assert
      ok(mockLogger.info.calledWith("[CharacterRepository.saveSelectedCharacters] started."));
      ok(mockLogger.info.calledWith("[CharacterRepository.saveSelectedCharacters] finished."));
      equal(mockLogger.info.callCount, 2);
    });

    it("should call [localDataSource.saveSelectedCharacters] with correct params", () => {
      // arrange
      mockLocalDataSource.saveSelectedCharacters.returns();

      // act
      repository.saveSelectedCharacters(params);

      // assert
      ok(mockLocalDataSource.saveSelectedCharacters.calledOnceWith(params));
    });

    it("should return [Right(null)]", () => {
      // arrange
      mockLocalDataSource.saveSelectedCharacters.returns();
      const expectedResult = new Right(null);

      // act
      const result = repository.saveSelectedCharacters(params);

      // assert
      deepEqual(result, expectedResult);
    });

    it("should return [Left(LocalStorageFailure)] if [LocalStorageException] is thrown", () => {
      // arrange
      const localStorageException = new LocalStorageException("localstorage-exception");
      mockLocalDataSource.saveSelectedCharacters.throws(localStorageException);
      const expectedFailure = new LocalStorageFailure(localStorageException);

      // act
      const result = repository.saveSelectedCharacters(params);

      // assert
      ok(mockLogger.warn.calledOnceWith("[CharacterRepository.saveSelectedCharacters] failed."));
      deepEqual(result, new Left(expectedFailure));
    });

    it("should return Left[(UnexpectedFailure)] if an unknown error occurs", () => {
      // arrange
      const unknownException = new Error("unknown-exception");
      mockLocalDataSource.saveSelectedCharacters.throws(unknownException);
      const expectedFailure = new UnexpectedFailure(unknownException);

      // act
      const result = repository.saveSelectedCharacters(params);

      // assert
      ok(mockLogger.warn.calledOnceWith("[CharacterRepository.saveSelectedCharacters] failed unexpectedly."));
      deepEqual(result, new Left(expectedFailure));
    });
  });

  describe("getSavedSelectedCharacters", () => {
    const mockResult: Character[] = [
      {
        id: "1",
        name: "Rick",
        image: "url",
        episode: [
          {
            "id": "1",
          },
        ],
      }
    ];

    beforeEach(() => {
      mockLogger.info.resetHistory();
      mockLogger.debug.resetHistory();
      mockLogger.error.resetHistory();
      mockLogger.warn.resetHistory();
      mockLocalDataSource.getSavedSelectedCharacters.resetHistory();
    });

    it("should call [Logger.info] correctly", () => {
      // arrange
      mockLocalDataSource.getSavedSelectedCharacters.returns(mockResult);

      // act
      repository.getSavedSelectedCharacters();

      // assert
      ok(mockLogger.info.calledWith("[CharacterRepository.getSavedSelectedCharacters] started."));
      ok(mockLogger.info.calledWith("[CharacterRepository.getSavedSelectedCharacters] finished."));
      equal(mockLogger.info.callCount, 2);
    });

    it("should call [localDataSource.getSavedSelectedCharacters] with correct params", () => {
      // arrange
      mockLocalDataSource.getSavedSelectedCharacters.returns(mockResult);

      // act
      repository.getSavedSelectedCharacters();

      // assert
      ok(mockLocalDataSource.getSavedSelectedCharacters.calledOnceWith());
    });

    it("should return the fetched characters from [Right(localDataSource.getSavedSelectedCharacters)]", () => {
      // arrange
      mockLocalDataSource.getSavedSelectedCharacters.returns(mockResult);
      const expectedResult = new Right(mockResult);

      // act
      const result = repository.getSavedSelectedCharacters();

      // assert
      deepEqual(result, expectedResult);
    });

    it("should return [Left(LocalStorageFailure)] if [LocalStorageException] is thrown", () => {
      // arrange
      const localStorageException = new LocalStorageException("localstorage-exception");
      mockLocalDataSource.getSavedSelectedCharacters.throws(localStorageException);
      const expectedFailure = new LocalStorageFailure(localStorageException);

      // act
      const result = repository.getSavedSelectedCharacters();

      // assert
      ok(mockLogger.warn.calledOnceWith("[CharacterRepository.getSavedSelectedCharacters] failed."));
      deepEqual(result, new Left(expectedFailure));
    });

    it("should return Left[(UnexpectedFailure)] if an unknown error occurs", () => {
      // arrange
      const unknownException = new Error("unknown-exception");
      mockLocalDataSource.getSavedSelectedCharacters.throws(unknownException);
      const expectedFailure = new UnexpectedFailure(unknownException);

      // act
      const result = repository.getSavedSelectedCharacters();

      // assert
      ok(mockLogger.warn.calledOnceWith("[CharacterRepository.getSavedSelectedCharacters] failed unexpectedly."));
      deepEqual(result, new Left(expectedFailure));
    });
  });
});
