import { useState, useEffect, useRef } from "react";

type ConfirmModalProps = {
  title: string;
  message: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  showReason?: boolean;
  reasonPlaceholder?: string;
  confirmLabel?: string;
  confirmVariant?: "danger" | "primary";
};

export const ConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  showReason = false,
  reasonPlaceholder = "Masukkan alasan (opsional)...",
  confirmLabel = "Konfirmasi",
  confirmVariant = "primary",
}: ConfirmModalProps) => {
  const [reason, setReason] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  const handleConfirm = () => {
    onConfirm(showReason ? reason : undefined);
  };

  const confirmBtnClass = confirmVariant === "danger"
    ? "px-4 py-2 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
    : "px-4 py-2 text-sm font-semibold rounded-md bg-institution-900 text-white hover:bg-institution-800 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-institution-900";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl border border-institution-200 p-6 outline-none"
        style={{ animation: "slideUp 0.18s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <h2
          id="modal-title"
          className="text-base font-bold text-institution-900 mb-2"
        >
          {title}
        </h2>

        <p className="text-sm text-institution-600 mb-4 leading-relaxed">
          {message}
        </p>

        {showReason && (
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={reasonPlaceholder}
            rows={3}
            className="w-full text-sm text-institution-900 bg-institution-50 border border-institution-200 rounded-md px-3 py-2 mb-4 resize-none focus:outline-none focus:ring-1 focus:ring-institution-900 focus:border-institution-900 transition placeholder:text-institution-400"
          />
        )}

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold rounded-md text-institution-700 bg-white border border-institution-200 hover:bg-institution-50 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-institution-500"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={confirmBtnClass}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
