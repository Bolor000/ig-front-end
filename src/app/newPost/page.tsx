"use client";
import { NEW_POST } from "@/icons/newpost";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

const Page = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center py-4 font-extrabold">
        <button onClick={() => router.back()} className="mr-4 text-lg">&lt;</button>
        <div className="text-xl">New photo post</div>
      </div>

      <div className="my-8 flex justify-center">
        <NEW_POST />
      </div>

      <div className="flex flex-col gap-4 mt-8 items-center">
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <Button className="bg-blue-400" onClick={handleFileClick}>
            Upload Photo
          </Button>
          {fileName && <span className="text-gray-700">{fileName}</span>}
        </div>

        <button
          onClick={() => router.push("/create")}
          className="text-blue-400"
        >
          Generate with Ai
        </button>
      </div>
    </div>
  );
};

export default Page;
