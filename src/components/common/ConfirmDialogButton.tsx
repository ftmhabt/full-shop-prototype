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

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

type ConfirmDialogButtonProps = {
  buttonText: string | ReactNode;
  dialogTitle?: string;
  dialogDescription?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
} & ButtonProps;

export function ConfirmDialogButton({
  buttonText,
  dialogTitle = "تأیید عملیات",
  dialogDescription,
  confirmText = "تایید",
  cancelText = "انصراف",
  onConfirm,
  variant = "destructive",
  className,
  ...props
}: ConfirmDialogButtonProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={variant}
        className={className}
        {...props}
      >
        {buttonText}
      </Button>

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
          <DialogFooter className="flex justify-end gap-2">
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
