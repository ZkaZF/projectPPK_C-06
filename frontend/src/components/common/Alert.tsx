type AlertProps = {
  message: string;
  type?: "success" | "error" | "warning" | "info";
};

export const Alert = ({ message, type = "info" }: AlertProps) => {
  const getAlertClass = () => {
    switch (type) {
      case "success":
        return "alert alert-success";

      case "error":
        return "alert alert-danger";

      case "warning":
        return "alert alert-warning";

      case "info":
        return "alert alert-info";

      default:
        return "alert alert-info";
    }
  };

  return (
    <div className={getAlertClass()} role="alert">
      {message}
    </div>
  );
};