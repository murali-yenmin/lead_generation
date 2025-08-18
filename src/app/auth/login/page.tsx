import { Suspense } from "react";
import LoginPage from "./LoginPage";
import { LoadingScreen } from "@/app/layout";

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen/>}>
      <LoginPage />
    </Suspense>
  );
}
