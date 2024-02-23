import { inject, injectable } from "tsyringe";
import Logger from "../../../../core/Logger";
import Character from "../models/Character";
import Tokens from "../../../../bin/Tokens";
import { LocalStorageException } from "../../../../core/error/exceptions";

export const KEY_SAVED_CHARACTERS: string = "SAVED_CHARACTERS";

interface CharacterLocalDataSource {
  saveSelectedCharacters(characters: Character[]): void;
  getSavedSelectedCharacters(): Character[];
}

@injectable()
class CharacterLocalDataSourceImpl implements CharacterLocalDataSource {
  private readonly logger: Logger;

  constructor(@inject(Tokens.logger) logger: Logger) {
    this.logger = logger;
  }

  saveSelectedCharacters(characters: Character[]): void {
    this.logger.info("[CharacterLocalDataSource.saveSelectedCharacters] started.");

    try {
      localStorage.setItem(KEY_SAVED_CHARACTERS, JSON.stringify(characters));
    } catch (e) {
      this.logger.warn("[CharacterLocalDataSource.saveSelectedCharacters] failed.");
      this.logger.error(e as Error);
      this.logger.warn("[CharacterLocalDataSource.saveSelectedCharacters] finished with a [LocalStorageException].");
      throw new LocalStorageException(e);
    }

    this.logger.info("[CharacterLocalDataSource.saveSelectedCharacters] finished.");
  }

  getSavedSelectedCharacters(): Character[] {
    this.logger.info("[CharacterLocalDataSource.getSavedSelectedCharacters] started.");

    let charactersJsonString: string | null;

    try {
      charactersJsonString = localStorage.getItem(KEY_SAVED_CHARACTERS);
    } catch (e) {
      this.logger.warn("[CharacterLocalDataSource.getSavedSelectedCharacters] failed.");
      this.logger.error(e as Error);
      this.logger.warn("[CharacterLocalDataSource.getSavedSelectedCharacters] finished with a [LocalStorageException].");

      throw new LocalStorageException(e);
    }

    this.logger.info("[CharacterLocalDataSource.getSavedSelectedCharacters] finished.");

    if (charactersJsonString !== null) {
      return JSON.parse(charactersJsonString);
    }

    return [];
  }
}

export type {
  CharacterLocalDataSource
};

export default CharacterLocalDataSourceImpl;
