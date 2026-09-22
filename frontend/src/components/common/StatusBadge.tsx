type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getBadgeClass = () => {
    switch (status) {
      case "approved":
      case "active":
      case "selesai":
      case "aktif":
        return "badge bg-success";

      case "pending":
      case "baru":
      case "diproses":
      case "dalam_perbaikan":
        return "badge bg-warning text-dark";

      case "rejected":
      case "ditolak":
      case "nonaktif":
        return "badge bg-danger";

      case "cancelled":
        return "badge bg-secondary";

      default:
        return "badge bg-secondary";
    }
  };

  return <span className={getBadgeClass()}>{status}</span>;
};