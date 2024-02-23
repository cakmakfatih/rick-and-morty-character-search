import { Either, Left, Right } from "@typed-f/either";
import { ApolloFailure, Failure, FormatFailure, LocalStorageFailure, NON_LATIN_CHARACTERS_ERR_MSG, UnexpectedFailure } from "../../../../core/error/failures";
import SearchCharacterParams from "../../domain/entities/SearchCharacterParams";
import CharacterRepository from "../../domain/repositories/CharacterRepository";
import SearchCharacterData from "../models/SearchCharacterData";
import Character from "../models/Character";
import { inject, injectable } from "tsyringe";
import Logger from "../../../../core/Logger";
import Tokens from "../../../../bin/Tokens";
import { ApolloException, LocalStorageException } from "../../../../core/error/exceptions";
import CharacterLocalDataSource from "../datasources/CharacterLocalDataSource";
import CharacterRemoteDataSource from "../datasources/CharacterRemoteDataSource";

@injectable()
class CharacterRepositoryImpl implements CharacterRepository {
  private readonly logger: Logger;
  private readonly localDataSource: CharacterLocalDataSource;
  private readonly remoteDataSource: CharacterRemoteDataSource;

  constructor(
    @inject(Tokens.logger) logger: Logger,
    @inject(Tokens.characterLocalDataSource) localDataSource: CharacterLocalDataSource,
    @inject(Tokens.characterRemoteDataSource) remoteDataSource: CharacterRemoteDataSource,
  ) {
    this.logger = logger;
    this.localDataSource = localDataSource;
    this.remoteDataSource = remoteDataSource;
  }

  async search(params: SearchCharacterParams): Promise<Either<Failure, SearchCharacterData>> {
    try {
      this.logger.info("[CharacterRepository.search] started.");
      let result: SearchCharacterData;

      if (!(params.name.match(/^[A-Za-z\s]*$/))) {
        this.logger.warn("[CharacterRepository.search] failed.");

        return new Left(new FormatFailure(NON_LATIN_CHARACTERS_ERR_MSG));
      }

      params.name = params.name.replace(/ +(?= )/g, '').trim();

      result = await this.remoteDataSource.search(params);

      this.logger.info("[CharacterRepository.search] finished.");

      return new Right(result);
    } catch (error: unknown) {
      if (error instanceof ApolloException) {
        this.logger.warn("[CharacterRepository.search] failed.");

        return new Left(new ApolloFailure(error));
      }

      this.logger.warn("[CharacterRepository.search] failed unexpectedly.");

      return new Left(new UnexpectedFailure(error));
    }
  }

  saveSelectedCharacters(characters: Character[]): Either<Failure, null> {
    this.logger.info("[CharacterRepository.saveSelectedCharacters] started.");

    try {
      this.localDataSource.saveSelectedCharacters(characters);
    } catch (error: unknown) {
      if (error instanceof LocalStorageException) {
        this.logger.warn("[CharacterRepository.saveSelectedCharacters] failed.");

        return new Left(new LocalStorageFailure(error));
      }

      this.logger.warn("[CharacterRepository.saveSelectedCharacters] failed unexpectedly.");

      return new Left(new UnexpectedFailure(error));
    }

    this.logger.info("[CharacterRepository.saveSelectedCharacters] finished.");

    return new Right(null);
  }

  getSavedSelectedCharacters(): Either<Failure, Character[]> {
    this.logger.info("[CharacterRepository.getSavedSelectedCharacters] started.");

    try {
      const characters = this.localDataSource.getSavedSelectedCharacters();

      this.logger.info("[CharacterRepository.getSavedSelectedCharacters] finished.");

      return new Right(characters);
    } catch (error: unknown) {
      if (error instanceof LocalStorageException) {
        this.logger.warn("[CharacterRepository.getSavedSelectedCharacters] failed.");

        return new Left(new LocalStorageFailure(error));
      }

      this.logger.warn("[CharacterRepository.getSavedSelectedCharacters] failed unexpectedly.");

      return new Left(new UnexpectedFailure(error));
    }
  }
}

export default CharacterRepositoryImpl;
