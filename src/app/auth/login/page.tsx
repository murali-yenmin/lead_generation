import { Suspense } from "react";
import LoginPage from "./LoginPage";
import { LoadingScreen } from "@/components/loadingScreen";
 

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen/>}>
      <LoginPage />
    </Suspense>
  );
}
