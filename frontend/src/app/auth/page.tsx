/**
 * Authentication page - login and signup form container
 */

"use client";

import React, { useState } from "react";
import SignupForm from "@/components/auth/signup-form";
import LoginForm from "@/components/auth/login-form";
import { AuroraBackground } from "@/components/ui/aurora-background";

/** Authentication page with toggle between login and signup forms */
export default function Authentication() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <AuroraBackground className="overflow-hidden -z-10" />
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 pt-24 pb-20 md:px-8 md:pt-32 md:pb-40">
        <div className="relative mx-auto max-w-7xl rounded-[32px] border border-neutral-200/50 bg-neutral-100 p-2 backdrop-blur-lg md:p-4 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:backdrop-blur-md">
          <div className="mx-auto w-full max-w-md rounded-[24px] border border-neutral-200 bg-white p-2 dark:border-zinc-700/50 dark:bg-zinc-900/95 dark:backdrop-blur-sm">
            {isLogin ? (
              <LoginForm onToggle={() => setIsLogin(false)} />
            ) : (
              <SignupForm onToggle={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
