import { Either } from "@typed-f/either";
import { Failure } from "../../../../core/error/failures";
import CharacterRepository from "../repositories/CharacterRepository";
import SearchCharacterParams from "../entities/SearchCharacterParams";
import Character from "../../data/models/Character";

interface ISaveSelectedCharacters {
  (characters: Character[]): Either<Failure, null>;
}

function SaveSelectedCharacters(repository: CharacterRepository, characters: Character[]): Either<Failure, null> {
  return repository.saveSelectedCharacters(characters);
}

export type {
  ISaveSelectedCharacters,
  SearchCharacterParams,
};

export {
  SaveSelectedCharacters,
};
