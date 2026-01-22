export default function Error({ message }: { message: string }) {
  return (
    <div className="text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
      {message}
    </div>
  );
}
