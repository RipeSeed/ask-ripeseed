"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="m-auto flex h-full w-full flex-col items-center  justify-center gap-4">
      Coming Soon!
      <Button className="rounded-full" onClick={() => router.back()}>
        Go Back
      </Button>
    </div>
  );
}
