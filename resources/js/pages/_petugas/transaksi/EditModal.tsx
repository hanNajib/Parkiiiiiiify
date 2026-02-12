import { Transaksi } from "@/types";

interface EditModalProps {
    transaksi: Transaksi;
}

// Note: Edit modal for transactions is not typically needed
// Transactions are created (check-in) and updated to completed (check-out)
// This component exists for compatibility but is not used in the UI
export default function EditModal({ transaksi }: EditModalProps) {
    return null;
}
