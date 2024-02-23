import { gql, TypedDocumentNode } from "@apollo/client";
import SearchCharacterParams from "../../domain/entities/SearchCharacterParams";
import CharacterData from "../models/SearchCharacterData";

const SearchCharactersQuery: TypedDocumentNode<CharacterData, SearchCharacterParams> = gql(/* GraphQL */`
  query SearchCharacters($page: Int!, $name: String!) {
    characters(page: $page, filter: { name: $name }) {
      info {
        count
      }
      results {
        id,
        name,
        image,
        episode {
          id,
        },
      }
    }
  }
`);

export default SearchCharactersQuery;
