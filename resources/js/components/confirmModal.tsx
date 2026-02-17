import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useForm } from "@inertiajs/react";
import { Loader2, Trash2 } from "lucide-react"
import { FormEventHandler, ReactNode } from "react";

interface ConfirmDeleteProps {
  deleteUrl: string;
  title?: string;
  description?: string;
  children: ReactNode;
  onSuccess?: () => void;
  cancelText?: string;
  confirmText?: string;
  variant?: "destructive" | "default";
}

export function ConfirmDelete({ 
  deleteUrl, 
  title = "Konfirmasi Penghapusan",
  description = "Tindakan ini tidak dapat dibatalkan. Data yang sudah dihapus akan hilang secara permanen.",
  children,
  onSuccess,
  cancelText = "Batal",
  confirmText = "Hapus",
  variant = "destructive"
}: ConfirmDeleteProps) {
  const { delete: deleteAction, processing } = useForm({});
  
  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    deleteAction(deleteUrl, {
      onSuccess: () => {
        onSuccess?.();
      }
    });
  }

  const buttonClass = variant === "destructive" 
    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    : "";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="mr-4" disabled={processing}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction 
              type="submit" 
              disabled={processing}
              className={buttonClass}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {confirmText}...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {confirmText}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}