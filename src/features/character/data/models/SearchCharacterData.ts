import Character from "./Character";

interface SearchCharacterData {
  characters: {
    info: {
      count: number;
    };
    results: Character[];
  };
}

export default SearchCharacterData;
