"use client";
import { upload } from "@vercel/blob/client";
import { useUser } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const HuggingFaceImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?._id) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You are not signed in");
          return;
        }

        const res = await fetch(`https://ig-back-end-rgcc.onrender.com/users/profile/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch user profile");

        setUserProfile(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not fetch user profile");
      }
    };

    fetchUserProfile();
  }, [user?._id]);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setImageUrl([]);

    try {
     
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const blob = await response.blob();

      const file = new File([blob], "generated.png", { type: "image/png" });

      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setImageUrl((prev) => [...prev, uploaded.url]);
      toast.success("Image generated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async () => {
    if (!caption.trim() || !imageUrl) {
      toast.error("Please add a caption and generate an image first");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not signed in");
        return;
      }

      const response = await fetch("https://ig-back-end-rgcc.onrender.com/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caption,
          images: imageUrl,
          userId: user?._id,
        }),
      });

      const res = await response.json();

      if (response.ok) {
        toast.success("Post created successfully!");
        setCaption("");
        setImageUrl([]);
        setPrompt("");
        router.push("/");
      } else {
        toast.error(res.message || "Failed to create post");
        console.error(res);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Server error creating post");
    }
  };

  const setAsProfilePicture = async () => {
    if (!imageUrl) {
      toast.error("Please generate an image first");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not signed in");
        return;
      }

      const response = await fetch(`https://ig-back-end-rgcc.onrender.com/users/profilePicture`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profilePicture: imageUrl[0],
          userId: user?._id,
        }),
      });

      const res = await response.json();

      if (response.ok) {
        toast.success("Profile picture updated!");
        setUserProfile((prev: any) => ({ ...prev, profilePicture: imageUrl }));
        router.push(`/profile/${user?._id}`);
      } else {
        toast.error(res.message || "Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Server error updating profile picture");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-ig p-8">
        <div className="text-3xl font-bold text-center mb-2">
          <button onClick={() => router.back()} className="mr-4 text-lg">&lt;</button>
          AI IMAGE GENERATOR
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Describe your image
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Write whatever you want"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <Button
            onClick={generateImage}
            disabled={!prompt.trim() || isLoading}
            className="bg-pink-400 text-white hover:bg-pink-500"
          >
            {isLoading ? "Generating..." : "Generate"}
          </Button>

          {imageUrl && (
            <div>
              <h2 className="text-lg font-semibold mt-4">Your generated image</h2>
              {imageUrl && imageUrl.map((url,index)=>(
                <img key={index} src={url} alt="" />
              ))}
            </div>
          )}
        </div>

        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption"
          className="bg-gray-100 w-full mt-4 p-2 rounded"
        />

        <Button className="mt-4" onClick={createPost}>Create Post</Button>
        <Button
          className="mt-2 bg-blue-400 text-white hover:bg-blue-500"
          onClick={setAsProfilePicture}
        >
          Set as Profile Picture
        </Button>
      </div>
    </div>
  );
};

export default HuggingFaceImageGenerator;
