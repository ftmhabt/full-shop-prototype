import { ConfirmDialogButton } from "./ConfirmDialogButton";

export function ConfirmDelete({ onConfirm }: { onConfirm: () => void }) {
  return (
    <ConfirmDialogButton
      buttonText="حذف"
      dialogTitle="حذف محصول"
      dialogDescription="آیا از حذف این محصول مطمئن هستید؟ این عملیات قابل بازگشت نیست."
      onConfirm={onConfirm}
    />
  );
}
