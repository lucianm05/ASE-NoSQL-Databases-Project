import { ReactComponent as IconClose } from "@/assets/icons/close.svg";
import { Button } from "@/components/Button";
import dict from "@/constants/dict";
import useAlert from "@/features/alert/alert.store";
import type { Alert as TAlert } from "@/types";
import { cn } from "@/utils";
import { useEffect } from "react";
import classes from "./Alert.module.scss";

export const Alert = ({ id, type, message }: TAlert) => {
  const { closeAlert } = useAlert();

  useEffect(() => {
    const timeout = setTimeout(() => {
      closeAlert(id);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      role="alert"
      className={cn(
        "w-max absolute left-1/2 -translate-x-1/2 top-4 px-4 py-2 rounded-full text-lg pointer-events-auto shadow-md flex items-center space-x-2 text-slate-50",
        classes.alert,
        type === "success" ? "bg-green-500" : "bg-red-500"
      )}
    >
      <span>{message}</span>

      <Button
        aria-label={dict.en.close}
        title={dict.en.close}
        className="text-slate-50"
        onClick={() => {
          closeAlert(id);
        }}
        theme="none"
      >
        <IconClose width={24} height={24} />
      </Button>
    </div>
  );
};
