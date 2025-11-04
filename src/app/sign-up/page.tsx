"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IG_LOGO } from "@/icons/ig-logo";
import { toast } from "sonner";

const Page = () => {
  const { signUp, setToken, setUser } = useUser();
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await fetch("http://localhost:1212/users/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const res = await response.json();

      if (response.ok) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", res.user);
        toast.success("Sign Up successful!");
        push("/");
      } else {
        toast.error(res.message || "Sign Up failed");
      }
    } catch (err) {
      toast.error("Server error");
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-60">
      <div className="mb-9">
        <IG_LOGO />
      </div>
      <Input
        className="bg-gray-100 rounded-md w-64 mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        className="bg-gray-100 rounded-md w-64 mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        className="bg-gray-100 rounded-md w-64 mb-8"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button className="rounded-md w-64 bg-blue-400" onClick={handleSignUp}>
        Sign Up
      </Button>
      <div className="mt-4">Have an account?</div>
      <Button
        className="rounded-md w-64 mt-3 bg-blue-300"
        onClick={() => push("/login")}
      >
        Log In
      </Button>
    </div>
  );
};

export default Page;
