import { useState } from "react";

type ConfirmModalProps = {
  title: string;
  message: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  showReason?: boolean;
};

export const ConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  showReason = false,
}: ConfirmModalProps) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(showReason ? reason : undefined);
  };

  return (
    <div>
      <h2>{title}</h2>

      <p>{message}</p>

      {showReason && (
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Masukkan alasan"
        />
      )}

      <button onClick={onCancel}>Batal</button>
      <button onClick={handleConfirm}>Konfirmasi</button>
    </div>
  );
};