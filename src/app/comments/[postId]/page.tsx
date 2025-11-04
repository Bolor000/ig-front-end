"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider"; 
import { HOME } from "@/icons/home";
import { POSTNEW } from "@/icons/POSTNEW";
import { PROFILE } from "@/icons/profile";
import { SEARCH } from "@/icons/search";

export default function CommentsPage() {
  const { token, user } = useUser();
  const router = useRouter();
  const { postId } = useParams(); 
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [showDropdownId, setShowDropdownId] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:1212/comments/get/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComments(Array.isArray(data) ? data : Array.isArray(data.comments) ? data.comments : []);
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId, token]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`http://localhost:1212/comments/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, comment: newComment }),
      });
      setNewComment("");
      await fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:1212/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editingText.trim()) return;

    try {
      const res = await fetch(`http://localhost:1212/comments/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ comment: editingText }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Failed to update comment:", data);
        return;
      }

      const updatedComment = await res.json();
      setComments((prev) =>
        prev.map((c) => (c._id === id ? updatedComment : c))
      );
      setEditingId(null);
      setEditingText("");
      setShowDropdownId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex items-center p-4 border-b">
        <button onClick={() => router.back()} className="mr-4">&lt;</button>
        <h1 className="font-semibold text-lg">Comments</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {comments.length === 0 ? (
          <div className="text-gray-400 text-center">No comments yet</div>
        ) : (
          comments.map((c: any) => (
            <div key={c._id} className="flex items-start gap-3 relative">
              <img
                src={c.user?.profilePicture}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{c.user?.username || "Anonymous"}</div>

                  {c.user?._id === user?._id && (
                    <div className="relative">
                      <button
                        className="text-gray-400 font-bold px-2"
                        onClick={() =>
                          setShowDropdownId(showDropdownId === c._id ? null : c._id)
                        }
                      >
                        …
                      </button>
                      {showDropdownId === c._id && (
                        <div className="absolute right-0 bg-white border shadow-md rounded mt-1 z-10">
                          <button
                            className="block px-3 py-1 hover:bg-gray-100 w-full text-left"
                            onClick={() => {
                              setEditingId(c._id);
                              setEditingText(c.comment);
                              setShowDropdownId(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block px-3 py-1 hover:bg-gray-100 w-full text-left text-red-500"
                            onClick={() => handleDelete(c._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {editingId === c._id ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      className="flex-1 border rounded-full px-3 py-1"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEdit(c._id)}
                    />
                    <button
                      className="bg-blue-500 text-white px-3 rounded-full"
                      onClick={() => handleEdit(c._id)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div>{c.comment}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-16 left-0 w-full bg-white border-t p-3 flex items-center">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-600">
          Send
        </button>
      </div>

      <div className="fixed bottom-0 w-full bg-white border-t flex justify-around items-center p-2">
        <button className="flex flex-col items-center text-gray-700 hover:text-black">
          <HOME />
          <div className="text-xs">Home</div>
        </button>
        <button onClick={() => router.push("/newPost")} className="flex flex-col items-center text-gray-700 hover:text-black">
          <POSTNEW />
          <div className="text-xs">Post</div>
        </button>
        <button onClick={() => router.push("/search")} className="flex flex-col items-center text-gray-700 hover:text-black">
          <SEARCH />
          <div className="text-xs">Search</div>
        </button>
        <button onClick={() => router.push("/profile")} className="flex flex-col items-center text-gray-700 hover:text-black">
          <PROFILE />
          <div className="text-xs">Profile</div>
        </button>
      </div>
    </div>
  );
}
