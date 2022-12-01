// deno-lint-ignore-file no-explicit-any

import type { JSX } from "preact";
import { useState } from "preact/hooks";

type OnChangeEvent = JSX.TargetedEvent<HTMLElement, Event>;
type UseFormInputReturn = {
  value: string;
  onChange: (e: OnChangeEvent) => void;
};

export const useFormInput = (defaultValue = ""): UseFormInputReturn => {
  const [value, setValue] = useState(defaultValue);

  const onChange = (event: OnChangeEvent) => {
    if (
      !!event && !!event.target &&
      typeof (event.target as any).value === "string"
    ) {
      setValue((event.target as any).value);
    }
  };

  return { value, onChange };
};
