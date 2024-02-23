import { useEffect, useState } from "react";
import Layout from "../../../../core/components/Layout";
import MultiSelectWithImages, {
  MultiSelectOptionType,
} from "../../../../core/components/MultiSelectWithImages";
import { container } from "tsyringe";
import { ISearchCharacter } from "../../domain/usecases/SearchCharacter";
import Tokens from "../../../../bin/Tokens";
import SearchCharacterData from "../../data/models/SearchCharacterData";
import { ISaveSelectedCharacters } from "../../domain/usecases/SaveSelectedCharacters";
import { IGetSavedSelectedCharacters } from "../../domain/usecases/GetSavedSelectedCharacters";
import Character from "../../data/models/Character";

function mapApiResponse(data: SearchCharacterData): MultiSelectOptionType[] {
  return data.characters.results.map((i) => mapCharacterToSelectValue(i));
}

function mergeCharacterArrays(
  data: MultiSelectOptionType[],
  selectedCharacters: readonly MultiSelectOptionType[]
): MultiSelectOptionType[] {
  const formattedData = [...data];

  for (let character of selectedCharacters) {
    const doesCharacterExist =
      formattedData.findIndex((i) => character.value === i.value) !== -1;

    if (!doesCharacterExist) {
      formattedData.push(character);
    }
  }

  return formattedData;
}

function mapCharacterToSelectValue(
  character: Character
): MultiSelectOptionType {
  return {
    label: character.name,
    subtitle:
      character.episode.length +
      " " +
      (character.episode.length > 1 ? "Episodes" : "Episode"),
    value: character.id,
    image: character.image,
  };
}

function mapSelectValueToCharacter(
  selectValue: MultiSelectOptionType
): Character {
  return {
    id: selectValue.value,
    name: selectValue.label,
    episode: new Array<{ id: string }>(
      parseInt(selectValue.subtitle.split(" ")[0])
    ).fill({
      id: "id",
    }),
    image: selectValue.image,
  };
}

function SearchView() {
  const SEARCH_DELAY_MS = 300;
  const MIN_CHARACTER_LENGTH = 3;

  let page: number = 1;

  const searchCharacter = container.resolve<ISearchCharacter>(
    Tokens.searchCharacter
  );
  const saveSelectedCharacters = container.resolve<ISaveSelectedCharacters>(
    Tokens.saveSelectedCharacters
  );
  const getSavedSelectedCharacters =
    container.resolve<IGetSavedSelectedCharacters>(
      Tokens.getSavedSelectedCharacters
    );

  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [selectedCharacters, setSelectedCharacters] = useState<
    readonly MultiSelectOptionType[]
  >([]);
  const [options, setOptions] = useState<MultiSelectOptionType[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const savedSelectedCharacters = getSavedSelectedCharacters();

    if (savedSelectedCharacters.isRight()) {
      setSelectedCharacters(
        savedSelectedCharacters.value.map((i) => mapCharacterToSelectValue(i))
      );
      setOptions(mergeCharacterArrays(options, selectedCharacters));
    }
  }, []);

  useEffect(() => {
    if (input.length < MIN_CHARACTER_LENGTH) {
      setHasError(false);

      return;
    }

    const delayFetchFn = setTimeout(() => {
      setIsLoading(true);
      setHasError(false);

      searchCharacter({ page, name: input }).then((result) => {
        if (result.isRight()) {
          if (result.value.characters.info.count === null) {
            setOptions([...selectedCharacters]);

            setHasError(true);
            setErrorMessage("Nothing found.");

            setIsLoading(false);

            return;
          }

          const opts = mergeCharacterArrays(
            mapApiResponse(result.value),
            selectedCharacters
          );

          setOptions(opts);
        } else if (result.isLeft()) {
          setOptions([...selectedCharacters]);
          setHasError(true);

          if (result.value.message) setErrorMessage(result.value.message);
        }

        setIsLoading(false);
      });
    }, SEARCH_DELAY_MS);

    return () => clearTimeout(delayFetchFn);
  }, [input]);

  return (
    <Layout>
      <div className="search-wrapper">
        <div className="search-box">
          <MultiSelectWithImages
            input={input}
            onInputChange={(value, action) => {
              if (action.action === "input-change") {
                setInput(value);
              }
            }}
            onChange={(newCharacters: readonly MultiSelectOptionType[]) => {
              setSelectedCharacters(newCharacters);
              saveSelectedCharacters(
                newCharacters.map((i) => mapSelectValueToCharacter(i))
              );
            }}
            options={options}
            value={selectedCharacters}
            isLoading={isLoading}
            menuIsOpen={!hasError}
            hasError={hasError}
            errorMessage={errorMessage}
            noOptionsComponent={
              <span>
                {selectedCharacters.length >= options.length
                  ? "Start typing to search (min 3 characters)."
                  : "No options."}
              </span>
            }
          />
        </div>
      </div>
    </Layout>
  );
}

export default SearchView;
