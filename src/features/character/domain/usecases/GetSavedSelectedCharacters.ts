import { Either } from "@typed-f/either";
import { Failure } from "../../../../core/error/failures";
import CharacterRepository from "../repositories/CharacterRepository";
import SearchCharacterParams from "../entities/SearchCharacterParams";
import Character from "../../data/models/Character";

interface IGetSavedSelectedCharacters {
  (): Either<Failure, Character[]>;
}

function GetSavedSelectedCharacters(repository: CharacterRepository): Either<Failure, Character[]> {
  return repository.getSavedSelectedCharacters();
}

export type {
  IGetSavedSelectedCharacters,
  SearchCharacterParams,
};

export {
  GetSavedSelectedCharacters,
};
