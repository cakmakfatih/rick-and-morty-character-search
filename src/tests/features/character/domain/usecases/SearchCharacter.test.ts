import { stubInterface } from 'ts-sinon';
import CharacterRepository from '../../../../../features/character/domain/repositories/CharacterRepository';
import { ISearchCharacter, SearchCharacter, SearchCharacterParams } from '../../../../../features/character/domain/usecases/SearchCharacter';
import { ok, deepEqual } from "assert";
import { Either, Right } from "@typed-f/either";
import { Failure } from '../../../../../core/error/failures';
import SearchCharacterData from '../../../../../features/character/data/models/SearchCharacterData';

const mockRepository = stubInterface<CharacterRepository>();
const usecase: ISearchCharacter = (params: SearchCharacterParams) => SearchCharacter(mockRepository, params);

describe("SearchCharacter", () => {
  it("should call [CharacterRepository.search] once with correct params", async () => {
    // arrange
    const params: SearchCharacterParams = {
      page: 1,
      name: "Rick",
    };

    // act
    await usecase(params);

    // assert
    ok(mockRepository.search.calledOnceWith(params));
  });

  it("should return the value retrieved from [CharacterRepository.search]", async () => {
    // arrange
    const params: SearchCharacterParams = {
      page: 1,
      name: "Rick",
    };
    const mockResult = stubInterface<SearchCharacterData>();
    const repositoryResult: Either<Failure, SearchCharacterData> = new Right(mockResult);
    mockRepository.search.resolves(repositoryResult);

    // act
    const result = await usecase(params);

    // assert
    deepEqual(result, new Right(mockResult))
  });
});
