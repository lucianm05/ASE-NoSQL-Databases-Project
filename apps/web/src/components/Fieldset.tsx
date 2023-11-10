import { Component } from "@/types";
import { Children, isValidElement } from "react";

interface Props {
  label: string;
}

export const Fieldset: Component<Props> = ({ children, label }) => {
  if (Children.count(children) > 1) {
    throw new Error("Fieldset must have only one Input child");
  }

  const input = Children.only(children);

  if (!isValidElement(input)) return null;

  const { name } = input.props;

  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <label htmlFor={name} className="mb-1">
        {label}
      </label>
      {children}
    </fieldset>
  );
};

