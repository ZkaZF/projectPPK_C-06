export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID");
};

export const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString("id-ID");
};