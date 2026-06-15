"use client";

import { ThreeDButton } from "@godui/components";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-4 text-foreground">
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-2 font-sans text-4xl font-semibold">Page not found</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
      </div>
      <ThreeDButton onClick={() => router.push("/")}>Back to home</ThreeDButton>
    </main>
  );
}
