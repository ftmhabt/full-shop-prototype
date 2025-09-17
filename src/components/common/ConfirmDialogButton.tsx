"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VariantProps } from "class-variance-authority";
import { ReactNode, useState } from "react";

type ConfirmDialogButtonProps = {
  buttonText?: string | ReactNode;
  dialogTitle?: string;
  dialogDescription?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  children?: ReactNode; // ⬅️ اضافه شد
} & VariantProps<typeof buttonVariants>;

export function ConfirmDialogButton({
  buttonText,
  dialogTitle = "تأیید عملیات",
  dialogDescription,
  confirmText = "تایید",
  cancelText = "انصراف",
  onConfirm,
  children,
  variant = "destructive",
  ...props
}: ConfirmDialogButtonProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      {buttonText && (
        <Button
          onClick={() => setOpen(true)}
          variant={variant}
          className="h-9 w-10"
          {...props}
        >
          {buttonText}
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md text-right">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            {dialogDescription && (
              <p className="text-sm text-muted-foreground mt-1">
                {dialogDescription}
              </p>
            )}
          </DialogHeader>

          {children}

          <DialogFooter className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {cancelText}
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              {confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
