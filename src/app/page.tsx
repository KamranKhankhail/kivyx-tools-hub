import { Stack } from "@mui/material";
import HeaderSection from "./_components/HeaderSection";
import ToolsThatDoSection from "./_components/ToolsThatDoSection";
import GetResultsSection from "./_components/GetResultsSection";
import BrowseByCategoriesSection from "./_components/BrowseByCategoriesSection";
import WhytoolshubSection from "./_components/WhytoolshubSection";
import ToolshubFaqsSection from "./_components/ToolshubFaqsSection";
export default function page() {
  return (
    <Stack>
      <HeaderSection />
      <ToolsThatDoSection />
      <GetResultsSection />
      <BrowseByCategoriesSection />
      <WhytoolshubSection />
      <ToolshubFaqsSection />
    </Stack>
  );
}
