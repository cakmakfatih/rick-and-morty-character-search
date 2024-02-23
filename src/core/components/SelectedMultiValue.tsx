import { CommonProps, GroupBase, MultiValueGenericProps } from "react-select";

function SelectedMultiValue<OptionsType>(
  props: OptionsType & {
    selectProps: any;
    data: {
      label: string;
      value: string;
    };
    onRemove: (value: string) => void;
  }
) {
  return (
    <div className="react-select__multi-value">
      <span>{props.data.label}</span>
      <div
        className="remove-btn"
        onClick={() => {
          props.onRemove(props.data.value);
        }}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path
            fill="#fff"
            d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
          ></path>
        </svg>
      </div>
    </div>
  );
}

export default SelectedMultiValue;
