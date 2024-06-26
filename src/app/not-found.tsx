"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="m-auto flex h-full w-full flex-col items-center  justify-center gap-4">
      The page your&apos;e looking for does not exist.
      <Button className="rounded-full" onClick={() => router.push('/')}>
        Go to Home
      </Button>
    </div>
  );
};

export default NotFound;
