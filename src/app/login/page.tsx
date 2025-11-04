"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IG_LOGO } from "@/icons/ig-logo";
import { toast } from "sonner";

const Page = () => {
  const { user, setUser, setToken } = useUser();
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const responce = await fetch("http://localhost:1212/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!responce.ok) {
        const err = await responce.json();
        toast.error(err.message || "Try again");
        return;
      }

      const data = await responce.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.user);
      setToken(data.token);
      setUser(data.user);

      toast.success("Amjilttai");
      push("/");
    } catch (err) {
      console.error(err);
      toast.error("Try again");
    }
  };

  useEffect(() => {
    if (user) push("/");
  }, [user]);

  return (
    <div className="flex-direction justify-items-center items-center py-60">
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
        className="bg-gray-100 rounded-md w-64 mb-5"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button className="flex rounded-md w-64 mb-2 bg-blue-400" onClick={login}>
        Log In
      </Button>
      <div>OR</div>
      <Button
        className="flex rounded-md w-64 mt-3 bg-blue-300"
        onClick={() => push("/sign-up")}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default Page;
