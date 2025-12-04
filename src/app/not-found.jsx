import NotFoundClient from "../components/common/NotFoundClient";
import { Suspense } from "react";

// ✅ SEO metadata (works on server)
export const metadata = {
  title: "404 | Page Not Found",
  description: "The requested page does not exist.",
  robots: {
    index: false, // ❌ don't index
    follow: false,
  },
};

export default function NotFound() {
  return (
    <Suspense>
      <NotFoundClient />
    </Suspense>
  );
}
