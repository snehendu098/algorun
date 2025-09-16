import Navbar from "@/components/common/nav";
import PlaygroundInteractions from "@/components/playground/interactions";
import RocketView from "@/components/playground/rocket-view";

export default function Home() {
  return (
    <div className="w-screen min-h-screen relative">
      {/* Nav */}
      <Navbar />
      {/* Grid */}
      <div className="p-4 pt-0 grid-cols-5 grid gap-4">
        <PlaygroundInteractions />
        <RocketView />
      </div>
    </div>
  );
}
