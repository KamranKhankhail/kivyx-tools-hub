"use client";
import { Stack } from "@mui/material";
import HeaderSection from "./_components/HeaderSection";
import ToolsThatDoSection from "./_components/ToolsThatDoSection";
import GetResultsSection from "./_components/GetResultsSection";
import BrowseByCategoriesSection from "./_components/BrowseByCategoriesSection";
import WhytoolshubSection from "./_components/WhytoolshubSection";
import ToolshubFaqsSection from "./_components/ToolshubFaqsSection";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    const currentSearchParams = new URLSearchParams(searchParams.toString());
    if (newSearchTerm) {
      currentSearchParams.set("search", newSearchTerm);
    } else {
      currentSearchParams.delete("search");
    }
    router.replace(`/?${currentSearchParams.toString()}`);
  };

  return (
    <Stack sx={{ overflow: "hidden" }}>
      <HeaderSection
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      <ToolsThatDoSection searchTerm={searchTerm} />
      <GetResultsSection />
      <BrowseByCategoriesSection />
      <WhytoolshubSection />
      <ToolshubFaqsSection />
    </Stack>
  );
}
