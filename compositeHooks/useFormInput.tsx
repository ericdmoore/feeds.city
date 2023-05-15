// deno-lint-ignore-file no-explicit-any

import type { JSX } from "preact";
import { useState } from "preact/hooks";

type OnChangeEvent = JSX.TargetedEvent<HTMLElement, Event>;

type UseFormInputReturn = {
  value: string;
  onChange?: (e: OnChangeEvent) => void;
  onBlur?: (e: OnChangeEvent) => void;
  onSubmit?: (e: OnChangeEvent) => void;
  onTouched?: (e: OnChangeEvent) => void;
};

export const useFormInput = (
  defaultValue = "",
  mode: "onChange" | "onBlur" | "onSubmit" | "onTouched",
): UseFormInputReturn => {
  const [value, setValue] = useState(defaultValue);

  const onEvent = (event: OnChangeEvent) => {
    console.log("onEvent", { event });

    event &&
      !!event.target &&
      typeof (event.target as any).value === "string" &&
      setValue((event.target as any).value);
  };

  return {
    value,
    onChange: onEvent,
    onBlur: onEvent,
    onSubmit: onEvent,
    onTouched: onEvent,
  };
};

export default useFormInput;
