import { stubInterface } from 'ts-sinon';
import CharacterRepository from '../../../../../features/character/domain/repositories/CharacterRepository';
import { ok, deepEqual } from "assert";
import { Either, Right } from "@typed-f/either";
import { Failure } from '../../../../../core/error/failures';
import { GetSavedSelectedCharacters, IGetSavedSelectedCharacters } from '../../../../../features/character/domain/usecases/GetSavedSelectedCharacters';
import Character from '../../../../../features/character/data/models/Character';

const mockRepository = stubInterface<CharacterRepository>();
const usecase: IGetSavedSelectedCharacters = () => GetSavedSelectedCharacters(mockRepository);

describe("GetSavedSelectedCharacters", () => {
  it("should call [CharacterRepository.getSavedSelectedCharacters] once with correct params", () => {
    // act
    usecase();

    // assert
    ok(mockRepository.getSavedSelectedCharacters.calledOnceWith());
  });

  it("should return the value retrieved from [CharacterRepository.getSavedSelectedCharacters]", () => {
    // arrange
    const mockResult = stubInterface<Character[]>();
    const repositoryResult: Either<Failure, Character[]> = new Right(mockResult);
    mockRepository.getSavedSelectedCharacters.returns(repositoryResult);

    // act
    const result = usecase();

    // assert
    deepEqual(result, new Right(mockResult))
  });
});
