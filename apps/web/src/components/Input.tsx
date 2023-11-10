import { forwardRef } from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export const Input = forwardRef<HTMLInputElement, Props>(({ ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={`border rounded w-full p-1 bg-white disabled:bg-opacity-0 disabled:text-slate-400 disabled:cursor-not-allowed ${props.className}`}
    />
  );
});

