/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    signOut({
      redirect: false,
    }).then(() => {
      router.push("/");
    });
  }, []);

  return <div />;
}
