export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-institution-50">
      <div className="w-10 h-10 rounded-full border-4 border-institution-200 border-t-institution-900 animate-spin" />
      <p className="mt-4 text-xs font-mono text-institution-400 tracking-wider">Memuat...</p>
    </div>
  );
};