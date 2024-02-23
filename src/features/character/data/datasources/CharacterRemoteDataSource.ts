import { inject, injectable } from "tsyringe";
import Logger from "../../../../core/Logger";
import Tokens from "../../../../bin/Tokens";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import SearchCharacterParams from "../../domain/entities/SearchCharacterParams";
import SearchCharactersQuery from "../queries/SearchCharactersQuery";
import { ApolloException } from "../../../../core/error/exceptions";
import SearchCharacterData from "../models/SearchCharacterData";

interface CharacterRemoteDataSource {
  search(searchCharacterParams: SearchCharacterParams): Promise<SearchCharacterData>;
}

@injectable()
class CharacterRemoteDataSourceImpl implements CharacterRemoteDataSource {
  private logger: Logger;
  private apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor(@inject(Tokens.logger) logger: Logger, @inject(Tokens.apolloClient) apolloClient: ApolloClient<NormalizedCacheObject>) {
    this.logger = logger;
    this.apolloClient = apolloClient;
  }

  async search(searchCharacterParams: SearchCharacterParams): Promise<SearchCharacterData> {
    this.logger.info("[CharacterRemoteDataSource.search] started.");

    const result = await this.apolloClient.query({
      query: SearchCharactersQuery,
      variables: searchCharacterParams,
    });

    if (result.error) {
      this.logger.warn("[CharacterRemoteDataSource.search] failed.");
      this.logger.error(result.error);
      this.logger.warn("[CharacterRemoteDataSource.search] finished with an [ApolloException].");

      throw new ApolloException(result.error);
    }

    this.logger.info("[CharacterRemoteDataSource.search] finished.");

    return result.data;
  }
}

export type {
  CharacterRemoteDataSource,
};

export default CharacterRemoteDataSourceImpl;
