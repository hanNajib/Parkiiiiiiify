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
}

export function ConfirmDelete({ 
  deleteUrl, 
  title = "Konfirmasi Penghapusan",
  description = "Tindakan ini tidak dapat dibatalkan. Data yang sudah dihapus akan hilang secara permanen.",
  children,
  onSuccess
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

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              type="submit" 
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}