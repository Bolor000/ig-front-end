"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/AuthProvider";

export default function SearchPage() {
  const { token } = useUser();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:1212/users/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center py-4 font-extrabold">
        <button onClick={() => router.back()} className="mr-4 text-lg">
          &lt;
        </button>
        <div className="text-xl">Search Users</div>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username..."
          className="flex-1 border p-2 rounded-l"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 rounded-r"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div>
        {results.length === 0 && !loading && <div>No results found.</div>}
        <div>
          {results.map((user) => (
            <div
              key={user._id}
              onClick={() => router.push(`/othersPro/${user._id}`)}
              className="border-b py-2 cursor-pointer hover:bg-gray-100"
            >
              <div className="font-semibold">{user.username}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
