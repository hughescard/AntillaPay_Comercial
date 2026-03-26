import { Navbar } from "@/common/components/ui/Navbar";
import { DashboardView } from "./dashboard/DashboardView";
import { Header } from "@/common/components/layout/Header";

export default function Home() {
  return (
    <div className="flex h-full min-h-0 overflow-hidden flex-col lg:flex-row">
      <Navbar/>
      <div className="min-w-0 flex-1 min-h-0 flex flex-col">
        <Header/>
        <div className="flex-1 min-h-0 overflow-y-auto px-[7vw] py-8">
          <DashboardView/>
        </div>
      </div>
    </div>
  );
}
