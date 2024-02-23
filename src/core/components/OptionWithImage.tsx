import Highlighter from "react-highlight-words";
import { components, GroupBase, OptionProps } from "react-select";

interface OptionWithImageType {
  label: string;
  value: string;
  image: string;
  subtitle: string;
}

function OptionWithImage<
  OptionType,
  IsMulti extends boolean = true,
  GroupType extends GroupBase<OptionWithImageType> = GroupBase<OptionWithImageType>
>({
  searchWord,
  ...props
}: OptionProps<OptionWithImageType, IsMulti, GroupType> & {
  searchWord?: string;
}) {
  const option: OptionWithImageType = props.data;

  return (
    <components.Option {...props} className="multiselect-opt">
      <input type="checkbox" checked={props.isSelected} readOnly />
      <div
        className="select-img"
        style={{
          backgroundImage: `url('${option.image}')`,
        }}
      ></div>
      <div className="multiselect-content">
        <Highlighter
          autoEscape={true}
          searchWords={
            searchWord ? [searchWord.replace(/ +(?= )/g, "").trim()] : []
          }
          textToHighlight={option.label}
          highlightClassName="highlight"
          highlightTag={"span"}
          className="opt-label-title"
        />
        <span className="opt-label-description">{option.subtitle}</span>
      </div>
    </components.Option>
  );
}

export type { OptionWithImageType };

export default OptionWithImage;
