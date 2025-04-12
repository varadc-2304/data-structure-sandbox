
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DataStructures from "./pages/DataStructures";
import CPUScheduling from "./pages/CPUScheduling";
import PageReplacement from "./pages/PageReplacement";
import DiskScheduling from "./pages/DiskScheduling";
import ArrayVisualizer from "./pages/visualizers/ArrayVisualizer";
import LinkedListVisualizer from "./pages/visualizers/LinkedListVisualizer";
import StackVisualizer from "./pages/visualizers/StackVisualizer";
import QueueVisualizer from "./pages/visualizers/QueueVisualizer";
import DequeVisualizer from "./pages/visualizers/DequeVisualizer";
import BinaryTreeVisualizer from "./pages/visualizers/BinaryTreeVisualizer";
import BSTVisualizer from "./pages/visualizers/BSTVisualizer";
import GraphVisualizer from "./pages/visualizers/GraphVisualizer";
import FCFSVisualizer from "./pages/visualizers/FCFSVisualizer";
import SJFVisualizer from "./pages/visualizers/SJFVisualizer";
import PriorityVisualizer from "./pages/visualizers/PriorityVisualizer";
import RoundRobinVisualizer from "./pages/visualizers/RoundRobinVisualizer";
import FIFOVisualizer from "./pages/visualizers/FIFOVisualizer";
import FCFSDiskVisualizer from "./pages/visualizers/FCFSDiskVisualizer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Data Structures */}
          <Route path="/data-structures" element={<DataStructures />} />
          <Route path="/data-structures/array" element={<ArrayVisualizer />} />
          <Route path="/data-structures/linked-list" element={<LinkedListVisualizer />} />
          <Route path="/data-structures/stack" element={<StackVisualizer />} />
          <Route path="/data-structures/queue" element={<QueueVisualizer />} />
          <Route path="/data-structures/deque" element={<DequeVisualizer />} />
          <Route path="/data-structures/binary-tree" element={<BinaryTreeVisualizer />} />
          <Route path="/data-structures/bst" element={<BSTVisualizer />} />
          <Route path="/data-structures/graph" element={<GraphVisualizer />} />
          
          {/* CPU Scheduling */}
          <Route path="/cpu-scheduling" element={<CPUScheduling />} />
          <Route path="/cpu-scheduling/fcfs" element={<FCFSVisualizer />} />
          <Route path="/cpu-scheduling/sjf" element={<SJFVisualizer />} />
          <Route path="/cpu-scheduling/priority" element={<PriorityVisualizer />} />
          <Route path="/cpu-scheduling/round-robin" element={<RoundRobinVisualizer />} />
          
          {/* Page Replacement */}
          <Route path="/page-replacement" element={<PageReplacement />} />
          <Route path="/page-replacement/fifo" element={<FIFOVisualizer />} />
          
          {/* Disk Scheduling */}
          <Route path="/disk-scheduling" element={<DiskScheduling />} />
          <Route path="/disk-scheduling/fcfs" element={<FCFSDiskVisualizer />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
