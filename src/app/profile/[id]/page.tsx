"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { HOME } from "@/icons/home";
import { New } from "@/icons/new";
import { PROFILE } from "@/icons/profile";
import { SEARCH } from "@/icons/search";
import { useRouter } from "next/navigation";

type Post = {
  _id: string;
  caption: string;
  images: string[];
  likes: string[];
  user: string;
  comments: string[];
  createdAt: string;
  updateAt: string;
};

export default function ProfilePage() {
  const { token, user } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [profileImage, setProfileImage] = useState<string>("");

  const fetchUserPosts = async () => {
    if (!user?._id) return;

    try {
      const res = await fetch(
        `https://ig-back-end-rgcc.onrender.com/users/profile/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      setPosts(data.posts);
      setFollowersCount(data.followersCount);
      setFollowingCount(data.followingCount);
      setProfileImage(data.user.profilePicture);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  console.log(profileImage);
  useEffect(() => {
    if (token && user?._id) {
      fetchUserPosts();
    }
  }, [token, user]);

  return (
    <div className="max-w-md mx-auto font-sans bg-white min-h-screen">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <button onClick={() => router.back()} className="mr-4">
          &lt;
        </button>
        <h1 className="font-semibold text-lg">{user?.username}</h1>
        <div className="flex gap-4 text-xl"></div>
      </div>

      <div className="flex items-center justify-between px-4 py-4">
        <img
          src={profileImage || "/placeholder.png"}
          className="w-20 h-20 rounded-full"
        />
        <div className="flex-1 flex justify-around text-center">
          <div>
            <p className="font-semibold">{posts.length}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
          <div>
            <p className="font-semibold">{followersCount}</p>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div>
            <p className="font-semibold">{followingCount}</p>
            <p className="text-xs text-gray-500">Following</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        {user?.bio && <p className="text-sm text-gray-700">{user.bio}</p>}
      </div>

      <div className="px-4 mt-3">
        <button className="w-full border rounded-md py-2 font-semibold text-sm">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-3 gap-[6px] mt-4">
        {posts.length > 0 ? (
          posts.map((p, i) => {
            const imgSrc = p.images?.[0] ?? "/placeholder.png";

            return (
              <img
                key={i}
                alt="post"
                src={imgSrc}
                className="w-full h-42 object-cover"
              />
            );
          })
        ) : (
          <p className="text-center text-gray-400 text-sm col-span-3 mt-6">
            No posts yet
          </p>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t flex items-center justify-around p-2">
        <button className="flex flex-col items-center text-gray-700 hover:text-black">
          <HOME />
          <div className="text-xs">Home</div>
        </button>

        <button
          onClick={() => router.push("/newPost")}
          className="flex flex-col items-center text-gray-700 hover:text-black"
        >
          <New />
          <span className="text-xs">Post</span>
        </button>

        <button
          onClick={() => router.push("/search")}
          className="flex flex-col items-center text-gray-700 hover:text-black"
        >
          <SEARCH />
          <span className="text-xs">Search</span>
        </button>

        <button
          onClick={() => router.push(`/profile/${user?._id}`)}
          className="flex flex-col items-center text-gray-700 hover:text-black"
        >
          <PROFILE />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}
