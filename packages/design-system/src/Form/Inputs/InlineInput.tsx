import * as React from "react";
import { styled } from "../../stitches";
import { Box } from "../../Box";
import { useInput } from "../useForm";
import { InputProps } from "./Input";
import { baseInputStyles, baseTextInputStyle } from "../shared/styles";
import { useComposedRefs } from "../../internal/utils";
import { useKey, useMeasure } from "react-use";

type Actions =
  | { type: "startEditing"; originalValue: string }
  | { type: "endEditing" };

type State = { isEditing: boolean; originalValue?: string };

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case "startEditing":
      return {
        isEditing: true,
        originalValue: action.originalValue,
      };
    case "endEditing": {
      return { ...state, isEditing: false };
    }

    default:
      return state;
  }
}

const StyledBox = styled(Box, {
  ...baseInputStyles,
  border: 0,
  display: "flex",
  alignItems: "center",
  textStyle: "medium-text",

  "&:focus-within": {
    boxShadow: "none",
  },
});

const StyledInput = styled("input", {
  ...baseTextInputStyle,
  $$paddingInline: "$space$2",
  $$paddingBlock: "$space$2",
  $$width: "0px",
  paddingInline: "$$paddingInline",
  paddingBlock: "$$paddingBlock",
  backgroundColor: "transparent",
  outline: "none",
  //FIXME Stitches has an open issue in regards to the order in which classNames are applied -> https://github.com/modulz/stitches/issues/671
  // Since Input is not directly a styled component the order of the styles is not controlled correctly.
  borderColor: "transparent !important",
  boxShadow: "none !important",
  boxSizing: "content-box",
  textStyle: "inherit",

  "&:focus-visible": {
    boxShadow: "none",
    outline: "none",
  },
});

const SizingSpan = styled("span", {
  paddingInline: "$2",
  textStyle: "medium-text",
  whiteSpace: "pre-wrap",
});

export type InlineInputProps = InputProps & { IndicatorButton?: JSX.Element };

export const InlineInput = React.forwardRef<HTMLInputElement, InlineInputProps>(
  (
    {
      name,
      minLength,
      maxLength,
      regex,
      required,
      onChange,
      onBlur,
      value,
      disabled,
      alignByContent = "center",
      Buttons,
      IndicatorButton,
      css,
      ...props
    },
    forwardedRef
  ) => {
    const inputRef = useComposedRefs(forwardedRef);
    const [wrapperRef, { width }] = useMeasure<HTMLSpanElement>();

    const [state, dispatch] = React.useReducer(reducer, {
      isEditing: false,
    });
    const isEditing = disabled !== undefined ? !disabled : state.isEditing;

    const {
      value: formValue,
      blur,
      setBlur,
      setValue,
      setErrors,
      submitting,
    } = useInput(name, "string");

    const defaultValidationmessages = {
      required: "The field is required and can't be empty",
      minLength: `Please enter at least ${minLength} chars.`,
      regex: `The input doesn't fulfill the requirements.`,
      maxLength: `You've reached the maximum allowed characters (${maxLength}).`,
    };

    const validate = (inputValue: string) => {
      const errors: string[] = [];

      if (required && inputValue.length === 0) {
        errors.push(defaultValidationmessages.required);
      }

      if (minLength && inputValue.length < minLength) {
        errors.push(defaultValidationmessages.minLength);
      }

      if (regex && !new RegExp(regex).test(inputValue)) {
        errors.push(defaultValidationmessages.regex);
      }

      if (maxLength && inputValue.length === maxLength) {
        errors.push(defaultValidationmessages.maxLength);
      }

      return errors;
    };

    useKey("Enter", () => dispatch({ type: "endEditing" }));
    useKey(
      "Escape",
      () => {
        state.originalValue != null && setValue(state.originalValue);
        dispatch({ type: "endEditing" });
      },
      undefined,
      [state]
    );

    React.useEffect(() => {
      if (blur || submitting) {
        setErrors(validate(value ?? ""));
      }
    }, [value, blur, submitting]);

    React.useEffect(() => {
      if (isEditing) {
        inputRef.current?.select();
      } else {
        inputRef.current?.setSelectionRange(null, null);
      }
    }, [isEditing]);

    const EnhancedIndicatorButton = IndicatorButton
      ? React.cloneElement(IndicatorButton, {
          "data-active": isEditing,
          onClick: () =>
            dispatch({ type: "startEditing", originalValue: formValue }),
          type: "button",
          disabled,
        })
      : IndicatorButton;

    return (
      <StyledBox
        css={{ color: disabled ? "$gray8" : "$gray12" }}
        data-disabled={disabled}
      >
        <StyledInput
          name={name}
          ref={inputRef}
          value={value ?? formValue}
          onChange={(event) => {
            onChange ? onChange?.(event) : setValue(event.target.value ?? "");
          }}
          onBlur={(event) => {
            onBlur?.(event);
            setBlur(true);
            dispatch({ type: "endEditing" });
          }}
          onClick={() =>
            dispatch({ type: "startEditing", originalValue: formValue })
          }
          alignByContent={alignByContent}
          minLength={minLength}
          maxLength={maxLength}
          pattern={regex}
          required={required}
          css={{
            width: `${width}px`,
            ...css,
          }}
          {...props}
        />
        <SizingSpan
          ref={wrapperRef}
          style={{
            position: "absolute",
            left: "-9999px",
            display: "inline-block",
          }}
        >
          {formValue}
        </SizingSpan>
        {EnhancedIndicatorButton}
        {Buttons}
      </StyledBox>
    );
  }
);
