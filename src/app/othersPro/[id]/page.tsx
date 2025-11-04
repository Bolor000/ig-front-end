"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { HOME } from "@/icons/home";
import { POSTNEW } from "@/icons/POSTNEW";
import { PROFILE } from "@/icons/profile";
import { SEARCH } from "@/icons/search";
import { useRouter, useParams } from "next/navigation";

export default function ProfilePage() {
  const { token } = useUser();
  const router = useRouter();
  const { id } = useParams();   
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState([]);

  const fetchUserPosts = async () => {
    if (!id) return;

    try {
      const res = await fetch(
        `http://localhost:1212/users/profile-others/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      setProfile(data.user);
      setPosts(data.posts);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserPosts();
    }
  }, [token, id]);

  if (!profile) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto font-sans bg-white min-h-screen">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <button onClick={() => router.back()} className="mr-4">&lt;</button>
        <h1 className="font-semibold text-lg">{profile.username}</h1>
        <div></div>
      </div>

      <div className="flex items-center justify-between px-4 py-4">
        <img
          src={profile.profilePicture || "/placeholder.png"}
          className="w-20 h-20 rounded-full"
        />

        <div className="flex-1 flex justify-around text-center">
          <div>
            <p className="font-semibold">{posts.length}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
          <div>
            <p className="font-semibold">{profile.followers?.length || 0}</p>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div>
            <p className="font-semibold">{profile.following?.length || 0}</p>
            <p className="text-xs text-gray-500">Following</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        {profile.bio && (
          <p className="text-sm text-gray-700">{profile.bio}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-[6px] mt-4">
        {posts.length > 0 ? (
          posts.map((p: any, i: number) => (
            <img
              key={i}
              src={p.images?.[0] ?? "/placeholder.png"}
              className="w-full h-40 object-cover"
            />
          ))
        ) : (
          <p className="text-center text-gray-400 text-sm col-span-3 mt-6">
            No posts yet
          </p>
        )}
      </div>
    </div>
  );
}
