import { Either } from "@typed-f/either";
import { Failure } from "../../../../core/error/failures";
import SearchCharacterParams from "../entities/SearchCharacterParams";
import SearchCharacterData from "../../data/models/SearchCharacterData";
import Character from "../../data/models/Character";

interface CharacterRepository {
  search(params: SearchCharacterParams): Promise<Either<Failure, SearchCharacterData>>;
  saveSelectedCharacters(characters: Character[]): Either<Failure, null>;
  getSavedSelectedCharacters(): Either<Failure, Character[]>;
};

export default CharacterRepository;
