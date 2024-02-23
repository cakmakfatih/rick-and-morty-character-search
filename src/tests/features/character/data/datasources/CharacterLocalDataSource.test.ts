import { stubInterface } from "ts-sinon";
import Logger from "../../../../../core/Logger";
import CharacterLocalDataSourceImpl, { KEY_SAVED_CHARACTERS } from "../../../../../features/character/data/datasources/CharacterLocalDataSource";
import Character from "../../../../../features/character/data/models/Character";
import { deepEqual, equal, ok } from "assert";
import { LocalStorageException } from "../../../../../core/error/exceptions";

const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');

const mockLogger = stubInterface<Logger>();

const dataSource = new CharacterLocalDataSourceImpl(mockLogger);

const characters: Character[] = [
  {
    id: "1",
    name: "Rick",
    image: "image",
    episode: [
      {
        "id": "1",
      },
      {
        "id": "2",
      },
    ],
  },
];

describe("CharacterLocalDataSource", () => {
  describe("saveSelectedCharacters", () => {
    beforeEach(() => {
      mockLogger.info.resetHistory();
      mockLogger.debug.resetHistory();
      mockLogger.error.resetHistory();
      mockLogger.warn.resetHistory();
      setItemSpy.mockClear();
    });

    it("should call [Logger.info] correctly", () => {
      // act
      dataSource.saveSelectedCharacters(characters);

      // assert
      ok(mockLogger.info.calledWith("[CharacterLocalDataSource.saveSelectedCharacters] started."));
      ok(mockLogger.info.calledWith("[CharacterLocalDataSource.saveSelectedCharacters] finished."));
      equal(mockLogger.info.callCount, 2);
    });

    it("should call [localStorage.setItem()] with correct params", () => {
      // act
      dataSource.saveSelectedCharacters(characters);

      // assert
      expect(setItemSpy).toHaveBeenCalledWith(KEY_SAVED_CHARACTERS, JSON.stringify(characters));
      equal(setItemSpy.mock.calls.length, 1);
    });

    it("should throw [LocalStorageException] when [localStorage.setItem] throws", () => {
      // arrange
      const err = new Error("test-err");
      setItemSpy.mockImplementation(() => {
        throw err;
      });
      const expectedException = new LocalStorageException(err);

      // act & assert
      expect(() => dataSource.saveSelectedCharacters(characters)).toThrow(expectedException);
      ok(mockLogger.info.calledWith("[CharacterLocalDataSource.saveSelectedCharacters] started."));
      ok(mockLogger.warn.calledWith("[CharacterLocalDataSource.saveSelectedCharacters] failed."));
      ok(mockLogger.error.calledWith(err));
      ok(mockLogger.warn.calledWith("[CharacterLocalDataSource.saveSelectedCharacters] finished with a [LocalStorageException]."));
      equal(mockLogger.info.callCount, 1);
      equal(mockLogger.warn.callCount, 2);
      equal(mockLogger.error.callCount, 1);
    });
  });

  describe("getSavedSelectedCCharacters", () => {
    beforeEach(() => {
      mockLogger.info.resetHistory();
      mockLogger.debug.resetHistory();
      mockLogger.error.resetHistory();
      mockLogger.warn.resetHistory();
      getItemSpy.mockClear();
    });

    it("should call [Logger.info] correctly", () => {
      // arrange
      getItemSpy.mockImplementation(() => JSON.stringify(characters));

      // act
      dataSource.getSavedSelectedCharacters();

      // assert
      ok(mockLogger.info.calledWith("[CharacterLocalDataSource.getSavedSelectedCharacters] started."));
      ok(mockLogger.info.calledWith("[CharacterLocalDataSource.getSavedSelectedCharacters] finished."));
      equal(mockLogger.info.callCount, 2);
    });

    it("should call [localStorage.getItem()] with correct params", () => {
      // arrange
      getItemSpy.mockImplementation(() => JSON.stringify(characters));

      // act
      dataSource.getSavedSelectedCharacters();

      // assert
      expect(getItemSpy).toHaveBeenCalledWith(KEY_SAVED_CHARACTERS);
      equal(getItemSpy.mock.calls.length, 1);
    });

    it("should return [JSON.parse(localStorage.getItem())] if [localStorage.getItem] is not null", () => {
      // arrange
      getItemSpy.mockImplementation(() => JSON.stringify(characters));

      // act
      const result = dataSource.getSavedSelectedCharacters();

      // assert
      deepEqual(result, characters);
    });

    it("should return an empty array if [localStorage.getItem] is null", () => {
      // arrange
      getItemSpy.mockImplementation(() => null);

      // act
      const result = dataSource.getSavedSelectedCharacters();

      // assert
      deepEqual(result, []);
    });

    it("should throw [LocalStorageException] when [localStorage.getItem] throws", () => {
      // arrange
      const err = new Error("test-err");
      getItemSpy.mockImplementation(() => {
        throw err;
      });
      const expectedException = new LocalStorageException(err);

      // act & assert
      expect(() => dataSource.getSavedSelectedCharacters()).toThrow(expectedException);
      ok(mockLogger.info.calledWith("[CharacterLocalDataSource.getSavedSelectedCharacters] started."));
      ok(mockLogger.warn.calledWith("[CharacterLocalDataSource.getSavedSelectedCharacters] failed."));
      ok(mockLogger.error.calledWith(err));
      ok(mockLogger.warn.calledWith("[CharacterLocalDataSource.getSavedSelectedCharacters] finished with a [LocalStorageException]."));
      equal(mockLogger.info.callCount, 1);
      equal(mockLogger.warn.callCount, 2);
      equal(mockLogger.error.callCount, 1);
    });
  });
});


