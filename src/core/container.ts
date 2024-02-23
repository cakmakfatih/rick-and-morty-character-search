import { Lifecycle, container } from 'tsyringe';
import Tokens from '../bin/Tokens';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject
} from "@apollo/client";
import log from "loglevel";
import Logger from './Logger';
import CharacterRemoteDataSourceImpl from '../features/character/data/datasources/CharacterRemoteDataSource';
import { CharacterRemoteDataSource } from '../features/character/data/datasources/CharacterRemoteDataSource';
import CharacterLocalDataSourceImpl, { CharacterLocalDataSource } from '../features/character/data/datasources/CharacterLocalDataSource';
import CharacterRepository from '../features/character/domain/repositories/CharacterRepository';
import CharacterRepositoryImpl from '../features/character/data/repositories/CharacterRepositoryImpl';
import { GetSavedSelectedCharacters, IGetSavedSelectedCharacters } from '../features/character/domain/usecases/GetSavedSelectedCharacters';
import bindDependencies from '../utils/bindDependencies';
import { ISaveSelectedCharacters, SaveSelectedCharacters } from '../features/character/domain/usecases/SaveSelectedCharacters';
import { ISearchCharacter, SearchCharacter } from '../features/character/domain/usecases/SearchCharacter';


async function initExternal() {
  //! apollo client
  const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql",
    cache: new InMemoryCache(),
  });

  container.registerInstance<ApolloClient<NormalizedCacheObject>>(Tokens.apolloClient, client);

  //! loglevel
  log.setLevel("DEBUG");
  container.registerInstance<log.RootLogger>(Tokens.logLevel, log);
}

function initLogger() {
  //! registers logger
  container.register<Logger>(
    Tokens.logger,
    { useClass: Logger },
    { lifecycle: Lifecycle.Singleton }
  );
}

function initCharacter() {
  //! registers character feature

  //! datasources
  container.register<CharacterLocalDataSource>(Tokens.characterLocalDataSource, {
    useClass: CharacterLocalDataSourceImpl,
  }, { lifecycle: Lifecycle.Singleton });
  container.register<CharacterRemoteDataSource>(Tokens.characterRemoteDataSource, {
    useClass: CharacterRemoteDataSourceImpl,
  }, { lifecycle: Lifecycle.Singleton });

  //! repositories
  container.register<CharacterRepository>(Tokens.characterRepository, {
    useClass: CharacterRepositoryImpl,
  }, { lifecycle: Lifecycle.Singleton });

  //! usecases
  container.register<IGetSavedSelectedCharacters>(Tokens.getSavedSelectedCharacters, {
    useValue: bindDependencies(Tokens.characterRepository, GetSavedSelectedCharacters),
  });
  container.register<ISaveSelectedCharacters>(Tokens.saveSelectedCharacters, {
    useValue: bindDependencies(Tokens.characterRepository, SaveSelectedCharacters),
  });
  container.register<ISearchCharacter>(Tokens.searchCharacter, {
    useValue: bindDependencies(Tokens.characterRepository, SearchCharacter),
  });
}

async function init() {
  await initExternal();
  initLogger();
  initCharacter();
}

export default init;
