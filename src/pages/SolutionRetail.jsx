import SectorSolutionPage from "@/components/solutions/SectorSolutionPage";
import { getSectorSolutions } from "@/components/solutions/sectorSolutions";
import { useLanguage } from "@/components/i18n/LanguageContext";

export default function SolutionRetail() {
  const { language } = useLanguage();
  const sectorSolutions = getSectorSolutions(language);
  return <SectorSolutionPage solution={sectorSolutions.retail} />;
}
