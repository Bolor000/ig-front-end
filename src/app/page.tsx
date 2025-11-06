"use client";

import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { HOME } from "@/icons/home";
import { New } from "@/icons/new";
import { PROFILE } from "@/icons/profile";
import { SEARCH } from "@/icons/search";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const { token, user, logout } = useUser();
  const { push } = useRouter();
  const [posts, setPosts] = useState([]);
  const myId = user?._id;

  const fetchPosts = async () => {
    try {
      const res = await fetch("https://ig-back-end-rgcc.onrender.com/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const postLike = async (postId: string) => {
    const res = await fetch(
      `https://ig-back-end-rgcc.onrender.com/posts/toggle-like/${postId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }
    );
    if (res.ok) {
      fetchPosts();
    } else {
      toast.error("Failed to like post");
    }
  };

  const followUser = async (followedUserId: string) => {
    const res = await fetch(
      `https://ig-back-end-rgcc.onrender.com/users/follow-toggle/${followedUserId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }
    );
    if (res.ok) {
      toast.success("Follow status updated");
      fetchPosts();
    } else {
      toast.error("Failed to update follow status");
    }
  };

  useEffect(() => {
    if (!token) {
      push("/login");
    } else {
      fetchPosts();
    }
  }, [token]);

  return (
    <div className="max-w-md mx-auto p-0 bg-gray-50 ">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="font-semibold text-lg">Instagram</div>
        <button
          onClick={() => {
            logout();
            push("/login");
          }}
          className="font-semibold text-lg"
        >
          Log Out
        </button>
      </div>

      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <div
              key={post._id}
              className="bg-white border rounded-md shadow-sm"
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.user?.profilePicture}
                    className="w-10 h-10 rounded-full"
                  />

                  <div
                    onClick={() => push(`/othersPro/${post.user._id}`)}
                    className="font-semibold text-sm cursor-pointer"
                  >
                    {post.user?.username || "Unknown"}
                  </div>
                </div>

                {post.user.followers.includes(myId!) ? (
                  <button
                    onClick={() => followUser(post.user._id)}
                    className="font-semibold text-sm px-3 py-1 bg-gray-200 rounded"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => followUser(post.user._id)}
                    className="font-semibold text-sm px-3 py-1 bg-gray-200 rounded"
                  >
                    Follow
                  </button>
                )}
              </div>

              {post.images?.length > 0 && (
                <Carousel className="w-full">
                  <CarouselContent>
                    {post.images.map((img: string, index: number) => (
                      <CarouselItem key={index}>
                        <img
                          src={img}
                          alt={`post-${index}`}
                          className="w-full object-cover aspect-square"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}

              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                  <button onClick={() => postLike(post._id)}>
                    {post.likes.includes(myId) ? (
                      <Heart fill="red" color="red" />
                    ) : (
                      <Heart />
                    )}
                  </button>
                  <MessageCircle
                    onClick={() => push(`/comments/${post._id}`)}
                  />

                  <Send />
                </div>
                <Bookmark />
              </div>

              <div className="px-4 text-sm font-semibold">
                {post.likes.length} likes
              </div>

              <div className="px-4 pb-3 text-sm">
                <span className="font-semibold mr-2">
                  {post.user?.username || "Unknown"}
                </span>
                {post.caption}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10">No posts yet...</div>
        )}
      </div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t flex items-center justify-around p-2">
        <button className="flex flex-col items-center text-gray-700 hover:text-black">
          <HOME />
          <div className="text-xs">Home</div>
        </button>

        <button
          onClick={() => push("/newPost")}
          className="flex flex-col items-center text-gray-700 hover:text-black"
        >
          <New />
          <span className="text-xs">Post</span>
        </button>

        <button
          onClick={() => push("/search")}
          className="flex flex-col items-center text-gray-700 hover:text-black"
        >
          <SEARCH />
          <span className="text-xs">Search</span>
        </button>

        <button
          onClick={() => push(`/profile/${user?._id}`)}
          className="flex flex-col items-center text-gray-700 hover:text-black"
        >
          <PROFILE />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}
