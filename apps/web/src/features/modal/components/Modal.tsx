import { ReactComponent as IconClose } from "@/assets/icons/close.svg";
import { Button } from "@/components/Button";
import { Separator } from "@/components/Separator";
import dict from "@/constants/dict";
import useModal from "@/features/modal/modal.store";
import { cn } from "@/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const Modal = () => {
  const {
    isOpen,
    setIsOpen,
    config: { header, body, footer, classNames },
  } = useModal();

  if (!isOpen) return null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.DialogOverlay className="bg-black bg-opacity-25 absolute top-0 left-0 w-full h-full cursor-default z-[501]" />

        <DialogPrimitive.Content className="fixed top-0 left-0 w-full h-full z-[502] flex items-center justify-center">
          <div className="bg-white w-full max-w-[420px] min-h-[300px] flex flex-col justify-between rounded shadow-lg z-20">
            <div
              className={cn(
                "flex justify-between space-x-2 items-center font-medium text-lg p-4",
                classNames?.header
              )}
            >
              {header}

              <DialogPrimitive.Close asChild>
                <Button
                  theme="none"
                  aria-label={dict.en.close_modal}
                  title={dict.en.close_modal}
                  onClick={() => setIsOpen(false)}
                  className="ml-auto"
                >
                  <IconClose width={24} height={24} />
                </Button>
              </DialogPrimitive.Close>
            </div>

            {body && (
              <>
                <Separator />

                <div className={cn("p-4 flex-1", classNames?.body)}>{body}</div>
              </>
            )}

            {footer && (
              <>
                <Separator />

                <div className={cn("p-4", classNames?.footer)}>{footer}</div>
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
