export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID");
};

export const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};