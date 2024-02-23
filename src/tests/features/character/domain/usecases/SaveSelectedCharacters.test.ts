import { stubInterface } from 'ts-sinon';
import CharacterRepository from '../../../../../features/character/domain/repositories/CharacterRepository';
import { ok, deepEqual } from "assert";
import { Either, Right } from "@typed-f/either";
import { Failure } from '../../../../../core/error/failures';
import { SaveSelectedCharacters, ISaveSelectedCharacters } from '../../../../../features/character/domain/usecases/SaveSelectedCharacters';
import Character from '../../../../../features/character/data/models/Character';

const mockParams = stubInterface<Character[]>();
const mockRepository = stubInterface<CharacterRepository>();
const usecase: ISaveSelectedCharacters = (params: Character[]) => SaveSelectedCharacters(mockRepository, params);

describe("SaveSelectedCharacters", () => {
  it("should call [CharacterRepository.SaveSelectedCharacters] once with correct params", () => {
    // act
    usecase(mockParams);

    // assert
    ok(mockRepository.saveSelectedCharacters.calledOnceWith(mockParams));
  });

  it("should return the value retrieved from [CharacterRepository.SaveSelectedCharacters]", () => {
    // arrange
    const mockResult = null;
    const repositoryResult: Either<Failure, null> = new Right(mockResult);
    mockRepository.saveSelectedCharacters.returns(repositoryResult);

    // act
    const result = usecase(mockParams);

    // assert
    deepEqual(result, new Right(mockResult))
  });
});
