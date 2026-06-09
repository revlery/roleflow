import Image from "next/image";

export default function Home() {
  const columns = ["Wishlist", "Applied", "Interview"];
  return (
    <main className="flex gap-4 p-8 min-h-screen bg-gray-50">
      {columns.map((col) => (
        <div key={col} className="flex-1 bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-700 mb-4">{col}</h2>
          <div className="text-sm text-gray-400">No cards yet</div>
        </div>
      ))}
    </main>
  );
}
