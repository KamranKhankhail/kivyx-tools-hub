"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Footer from "../Footer";

export default function NavigationWrapper({ children }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [showFooter, setShowFooter] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isNavigating) {
      setShowFooter(false);
    }
  }, [isNavigating]);

  useEffect(() => {
    if (!isNavigating) {
      const checkPageReady = () => {
        const mainContent = document.querySelector("main") || document.body;
        if (mainContent && mainContent.children.length > 0) {
          setTimeout(() => {
            setShowFooter(true);
          }, 300);
        } else {
          setTimeout(checkPageReady, 100);
        }
      };
      setTimeout(checkPageReady, 500);
    }
  }, [isNavigating]);

  useEffect(() => {
    const handleClick = (e) => {
      const linkElement = e.target.closest("a[href]");
      if (linkElement) {
        const href = linkElement.getAttribute("href");

        // ✅ Special case: Contact Us
        if (href === "/#contact") {
          e.preventDefault();

          if (pathname === "/") {
            // Already on homepage → scroll directly
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth" });
          } else {
            // Navigate to homepage, then scroll after render
            router.push("/");

            setTimeout(() => {
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }, 600);
          }
          return;
        }

        // ✅ Default navigation
        if (href && href.startsWith("/") && !href.startsWith("//")) {
          setIsNavigating(true);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [pathname, router]);

  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, isNavigating]);

  return (
    <>
      {children}
      {showFooter && <Footer />}
    </>
  );
}
