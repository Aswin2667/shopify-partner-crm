import Graph from "./components/Graph";
import { TotalVistGraph } from "./components/TotalVistGraph";

export default function DashboardPage() {
  return (
    <div className="hidden flex-col md:flex p-4 ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex justify-evenly">
          <TotalVistGraph />
          <TotalVistGraph />
          <TotalVistGraph />
          <TotalVistGraph />
          <TotalVistGraph />
        </div>
      </div>
      <Graph />
    </div>
  );
}
