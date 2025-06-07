
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DataStructures from "./pages/DataStructures";
import CPUScheduling from "./pages/CPUScheduling";
import PageReplacement from "./pages/PageReplacement";
import DiskScheduling from "./pages/DiskScheduling";
import Algorithms from "./pages/Algorithms";

// Visualizers
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
import LRUVisualizer from "./pages/visualizers/LRUVisualizer";
import MRUVisualizer from "./pages/visualizers/MRUVisualizer";
import FCFSDiskVisualizer from "./pages/visualizers/FCFSDiskVisualizer";
import SSTFVisualizer from "./pages/visualizers/SSTFVisualizer";
import SCANVisualizer from "./pages/visualizers/SCANVisualizer";
import CSCANVisualizer from "./pages/visualizers/CSCANVisualizer";
import LOOKVisualizer from "./pages/visualizers/LOOKVisualizer";
import CLOOKVisualizer from "./pages/visualizers/CLOOKVisualizer";
import LinearSearchVisualizer from "./pages/visualizers/LinearSearchVisualizer";
import BinarySearchVisualizer from "./pages/visualizers/BinarySearchVisualizer";
import BubbleSortVisualizer from "./pages/visualizers/BubbleSortVisualizer";
import SelectionSortVisualizer from "./pages/visualizers/SelectionSortVisualizer";
import InsertionSortVisualizer from "./pages/visualizers/InsertionSortVisualizer";
import MergeSortVisualizer from "./pages/visualizers/MergeSortVisualizer";
import QuickSortVisualizer from "./pages/visualizers/QuickSortVisualizer";
import TowerOfHanoiVisualizer from "./pages/visualizers/TowerOfHanoiVisualizer";
import NQueensVisualizer from "./pages/visualizers/NQueensVisualizer";
import FractionalKnapsackVisualizer from "./pages/visualizers/FractionalKnapsackVisualizer";
import JobSequencingVisualizer from "./pages/visualizers/JobSequencingVisualizer";
import ZeroOneKnapsackVisualizer from "./pages/visualizers/ZeroOneKnapsackVisualizer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
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
              <Route path="/page-replacement/lru" element={<LRUVisualizer />} />
              <Route path="/page-replacement/mru" element={<MRUVisualizer />} />
              
              {/* Disk Scheduling */}
              <Route path="/disk-scheduling" element={<DiskScheduling />} />
              <Route path="/disk-scheduling/fcfs" element={<FCFSDiskVisualizer />} />
              <Route path="/disk-scheduling/sstf" element={<SSTFVisualizer />} />
              <Route path="/disk-scheduling/scan" element={<SCANVisualizer />} />
              <Route path="/disk-scheduling/c-scan" element={<CSCANVisualizer />} />
              <Route path="/disk-scheduling/look" element={<LOOKVisualizer />} />
              <Route path="/disk-scheduling/c-look" element={<CLOOKVisualizer />} />

              /* Algorithms */}
              <Route path="/algorithms" element={<Algorithms />} />
              <Route path="/algorithms/linear-search" element={<LinearSearchVisualizer />} />
              <Route path="/algorithms/binary-search" element={<BinarySearchVisualizer />} />
              <Route path="/algorithms/bubble-sort" element={<BubbleSortVisualizer />} />
              <Route path="/algorithms/selection-sort" element={<SelectionSortVisualizer />} />
              <Route path="/algorithms/insertion-sort" element={<InsertionSortVisualizer />} />
              <Route path="/algorithms/merge-sort" element={<MergeSortVisualizer />} />
              <Route path="/algorithms/quick-sort" element={<QuickSortVisualizer />} />
              <Route path="/algorithms/tower-of-hanoi" element={<TowerOfHanoiVisualizer />} />
              <Route path="/algorithms/n-queens" element={<NQueensVisualizer />} />
              <Route path="/algorithms/fractional-knapsack" element={<FractionalKnapsackVisualizer />} />
              <Route path="/algorithms/job-sequencing" element={<JobSequencingVisualizer />} />
              <Route path="/algorithms/0-1-knapsack" element={<ZeroOneKnapsackVisualizer />} />
            </Route>
            
            {/* Redirect root to auth if not logged in */}
            <Route path="/" element={<Navigate to="/auth" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
