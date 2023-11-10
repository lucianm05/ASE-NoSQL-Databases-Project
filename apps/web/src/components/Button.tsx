import { Component } from "@/types";
import { cn } from "@/utils";

const themes = {
  none: "",
  default: "bg-white disabled:bg-slate-200",
  danger: "bg-red-500 text-white disabled:bg-red-800",
} as const;
interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  theme?: keyof typeof themes;
}

export const Button: Component<Props> = ({
  children,
  type = "button",
  theme = "default",
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        "w-max",
        themes[theme],
        theme !== "none" &&
          "px-4 py-1 border rounded disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
};
