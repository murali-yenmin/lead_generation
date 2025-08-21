import { Logo } from "./logo";
import { Skeleton } from "./ui/skeleton";

export function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Logo className="size-12 animate-pulse" />
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  );
}