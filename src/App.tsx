
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CPUScheduling from "./pages/CPUScheduling";
import PageReplacement from "./pages/PageReplacement";
import DiskScheduling from "./pages/DiskScheduling";

// CPU Scheduling Visualizers
import FCFSVisualizer from "./pages/visualizers/FCFSVisualizer";
import SJFVisualizer from "./pages/visualizers/SJFVisualizer";
import RoundRobinVisualizer from "./pages/visualizers/RoundRobinVisualizer";
import PriorityVisualizer from "./pages/visualizers/PriorityVisualizer";

// Memory Management Visualizers
import FIFOVisualizer from "./pages/visualizers/FIFOVisualizer";
import LRUVisualizer from "./pages/visualizers/LRUVisualizer";
import OptimalVisualizer from "./pages/visualizers/OptimalVisualizer";

// Disk Scheduling Visualizers
import FCFSDiskVisualizer from "./pages/visualizers/FCFSDiskVisualizer";
import SSTFVisualizer from "./pages/visualizers/SSTFVisualizer";
import SCANVisualizer from "./pages/visualizers/SCANVisualizer";
import CSCANVisualizer from "./pages/visualizers/CSCANVisualizer";
import LOOKVisualizer from "./pages/visualizers/LOOKVisualizer";
import CLOOKVisualizer from "./pages/visualizers/CLOOKVisualizer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* CPU Scheduling */}
          <Route path="/cpu-scheduling" element={<CPUScheduling />} />
          <Route path="/cpu-scheduling/fcfs" element={<FCFSVisualizer />} />
          <Route path="/cpu-scheduling/sjf" element={<SJFVisualizer />} />
          <Route path="/cpu-scheduling/round-robin" element={<RoundRobinVisualizer />} />
          <Route path="/cpu-scheduling/priority" element={<PriorityVisualizer />} />
          
          {/* Memory Management */}
          <Route path="/memory-management" element={<PageReplacement />} />
          <Route path="/memory-management/fifo" element={<FIFOVisualizer />} />
          <Route path="/memory-management/lru" element={<LRUVisualizer />} />
          <Route path="/memory-management/optimal" element={<OptimalVisualizer />} />
          
          {/* Disk Scheduling */}
          <Route path="/disk-scheduling" element={<DiskScheduling />} />
          <Route path="/disk-scheduling/fcfs" element={<FCFSDiskVisualizer />} />
          <Route path="/disk-scheduling/sstf" element={<SSTFVisualizer />} />
          <Route path="/disk-scheduling/scan" element={<SCANVisualizer />} />
          <Route path="/disk-scheduling/c-scan" element={<CSCANVisualizer />} />
          <Route path="/disk-scheduling/look" element={<LOOKVisualizer />} />
          <Route path="/disk-scheduling/c-look" element={<CLOOKVisualizer />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
