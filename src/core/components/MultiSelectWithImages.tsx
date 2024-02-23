import {
  InputActionMeta,
  MultiValueGenericProps,
  GroupBase,
} from "react-select";
import Select from "react-select";
import OptionWithImage from "./OptionWithImage";
import SelectedMultiValue from "./SelectedMultiValue";

type MultiSelectOptionType = {
  label: string;
  subtitle: string;
  value: string;
  image: string;
};

function MultiSelectWithImages({
  input,
  onInputChange,
  options,
  onChange,
  value,
  isLoading = false,
  menuIsOpen = true,
  noOptionsComponent = <span>No Options</span>,
  loadingComponent = <span>Loading...</span>,
  hasError = false,
  errorMessage = "",
}: {
  input: string;
  onInputChange: (value: string, action: InputActionMeta) => void;
  options: MultiSelectOptionType[];
  onChange: (newValue: readonly MultiSelectOptionType[]) => void;
  value: readonly MultiSelectOptionType[];
  isLoading?: boolean;
  menuIsOpen?: boolean;
  noOptionsComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  hasError?: boolean;
  errorMessage?: string;
}) {
  return (
    <div className="select-container">
      <Select
        placeholder={input || "Search"}
        isMulti={true}
        menuIsOpen={menuIsOpen}
        inputValue={input}
        onInputChange={onInputChange}
        className="react-select-container"
        classNamePrefix="react-select"
        isClearable={false}
        components={{
          MultiValueContainer: (
            props: MultiValueGenericProps<
              {
                label: string;
                subtitle: string;
                value: string;
                image: string;
              },
              true,
              GroupBase<{
                label: string;
                subtitle: string;
                value: string;
                image: string;
              }>
            >
          ) => (
            <SelectedMultiValue
              {...props}
              onRemove={(val: string) => {
                props.selectProps.onChange(
                  value.filter((i) => i.value !== val),
                  {
                    action: "deselect-option",
                    name: undefined,
                    option: props.data,
                  }
                );
              }}
            />
          ),
          Option: (props) => <OptionWithImage {...props} searchWord={input} />,
        }}
        onChange={onChange}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        options={options}
        value={value}
        noOptionsMessage={() => noOptionsComponent}
        loadingMessage={() => loadingComponent}
        isLoading={isLoading}
        filterOption={(option) => {
          return option.label
            .toLowerCase()
            .includes(input.replace(/ +(?= )/g, "").trim());
        }}
      />
      {hasError && (
        <div className="react-select__menu react-select__menu-err">
          <div className="react-select__menu-list react-select__menu-list--is-multi">
            <div className="react-select__menu-notice react-select__menu-notice--no-options">
              <span className="span-err">
                {errorMessage ? errorMessage : "Unexpected error."}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { MultiSelectOptionType };

export default MultiSelectWithImages;
