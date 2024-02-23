import { ApolloClient, ApolloError, NormalizedCacheObject } from "@apollo/client";
import { stubInterface } from "ts-sinon";
import CharacterRemoteDataSourceImpl from "../../../../../features/character/data/datasources/CharacterRemoteDataSource";
import Logger from "../../../../../core/Logger";
import SearchCharacterParams from "../../../../../features/character/domain/entities/SearchCharacterParams";
import { deepEqual, equal, ok, rejects } from "assert";
import SearchCharactersQuery from "../../../../../features/character/data/queries/SearchCharactersQuery";
import { ApolloException } from "../../../../../core/error/exceptions";

const mockLogger = stubInterface<Logger>();
const mockApolloClient = stubInterface<ApolloClient<NormalizedCacheObject>>();

const dataSource = new CharacterRemoteDataSourceImpl(mockLogger, mockApolloClient);

const params: SearchCharacterParams = {
  page: 1,
  name: "Rick",
};
const successfulApiResponse = {
  "characters": {
    "info": {
      "count": 2,
    },
    "results": [
      {
        "id": "299",
        "name": "Robot Rick",
        "image": "https://rickandmortyapi.com/api/character/avatar/299.jpeg",
        "episode": [
          {
            "id": "10",
          },
        ],
      },
      {
        "id": "322",
        "name": "Simple Rick",
        "image": "https://rickandmortyapi.com/api/character/avatar/322.jpeg",
        "episode": [
          {
            "id": "28",
          },
        ],
      },
    ]
  }
};
const successfulApolloResponse: any = {
  error: null,
  data: successfulApiResponse,
}

describe("CharacterRemoteDataSource", () => {
  describe("search", () => {
    beforeEach(() => {
      mockLogger.info.resetHistory();
      mockLogger.debug.resetHistory();
      mockLogger.error.resetHistory();
      mockLogger.warn.resetHistory();
      mockApolloClient.query.resetHistory();
      mockApolloClient.query.resolves(successfulApolloResponse);
    });

    it("should call [Logger.info] correctly", async () => {
      // act
      await dataSource.search(params);

      // assert
      ok(mockLogger.info.calledWith("[CharacterRemoteDataSource.search] started."));
      ok(mockLogger.info.calledWith("[CharacterRemoteDataSource.search] finished."));
      equal(mockLogger.info.callCount, 2);
    });

    it("should call [apolloClient.query] with correct params", async () => {
      // act
      await dataSource.search(params);

      // assert
      ok(mockApolloClient.query.calledOnceWith({
        query: SearchCharactersQuery,
        variables: params
      }));
    });

    it("should throw [ApolloException] with correct properties if [apolloClient.query] has an error", async () => {
      // arrange
      const mockApolloErrData = { errorMessage: "test" };
      const err = new ApolloError(mockApolloErrData);
      const apolloException = new ApolloException(err);
      const apolloErrResponse: any = {
        error: err
      };
      mockApolloClient.query.resolves(apolloErrResponse);

      // act & assert
      await rejects(async () => { await dataSource.search(params); }, Error, apolloException);
      ok(mockLogger.info.calledWith("[CharacterRemoteDataSource.search] started."));
      ok(mockLogger.warn.calledWith("[CharacterRemoteDataSource.search] failed."));
      ok(mockLogger.error.calledWith(err));
      ok(mockLogger.warn.calledWith("[CharacterRemoteDataSource.search] finished with an [ApolloException]."));
      equal(mockLogger.info.callCount, 1);
      equal(mockLogger.warn.callCount, 2);
      equal(mockLogger.error.callCount, 1);
    });

    it("should return the correct data from [apolloClient.query.data]", async () => {
      // act
      const result = await dataSource.search(params);

      // assert
      deepEqual(result, successfulApiResponse);
    });
  });
});
