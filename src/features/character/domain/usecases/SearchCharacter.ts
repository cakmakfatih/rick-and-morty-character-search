import { Either } from "@typed-f/either";
import { Failure } from "../../../../core/error/failures";
import CharacterRepository from "../repositories/CharacterRepository";
import SearchCharacterParams from "../entities/SearchCharacterParams";
import SearchCharacterData from "../../data/models/SearchCharacterData";

interface ISearchCharacter {
  (params: SearchCharacterParams): Promise<Either<Failure, SearchCharacterData>>;
}

async function SearchCharacter(repository: CharacterRepository, params: SearchCharacterParams): Promise<Either<Failure, SearchCharacterData>> {
  return await repository.search(params);
}

export type {
  ISearchCharacter,
  SearchCharacterParams,
};

export {
  SearchCharacter,
};
