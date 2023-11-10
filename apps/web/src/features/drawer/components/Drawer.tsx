import { ReactComponent as IconClose } from "@/assets/icons/close.svg";
import { Button } from "@/components/Button";
import dict from "@/constants/dict";
import { useDrawer } from "@/features/drawer/drawer.store";
import { cn } from "@/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import classes from "./Drawer.module.scss";

export const Drawer = () => {
  const {
    isOpen,
    setIsOpen,
    config: { header, body, footer, onClose },
    setConfig,
  } = useDrawer();

  const [dialogOpen, setDialogOpen] = useState(isOpen);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null;

    if (isOpen) {
      setDialogOpen(isOpen);
      timeout = null;
    } else {
      timeout = setTimeout(() => {
        setDialogOpen(false);
        setConfig({});
      }, 250);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen]);

  return (
    <DialogPrimitive.Root open={dialogOpen} modal={false}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content asChild>
          <aside
            className={cn(
              "w-full max-w-[320px] fixed top-0 right-0 h-full bg-slate-50 z-[500] p-4 drop-shadow-xl flex flex-col",
              classes["drawer"],
              isOpen && classes["drawer__open"]
            )}
          >
            <div className="flex justify-between items-center">
              <DialogPrimitive.Title className="text-xl">
                {header}
              </DialogPrimitive.Title>

              <DialogPrimitive.Close asChild>
                <Button
                  className="self-start"
                  onClick={() => {
                    setIsOpen(false);
                    onClose?.();
                  }}
                  aria-label={dict.en.close_drawer}
                  title={dict.en.close_drawer}
                  theme="none"
                >
                  <IconClose width={32} height={32} />
                </Button>
              </DialogPrimitive.Close>
            </div>

            {body && <div className="py-6 flex-1">{body}</div>}

            {footer && <div>{footer}</div>}
          </aside>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
