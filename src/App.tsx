
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AutoLogin from "./pages/AutoLogin";
import IframeAuth from "./pages/IframeAuth";
import NotFound from "./pages/NotFound";
import { useIframe } from "./hooks/useIframe";
import { useEffect } from "react";

// Main category pages
import DataStructures from "./pages/DataStructures";
import Algorithms from "./pages/Algorithms";
import CPUScheduling from "./pages/CPUScheduling";
import PageReplacement from "./pages/PageReplacement";
import DiskScheduling from "./pages/DiskScheduling";
import ECEAlgorithms from "./pages/ECEAlgorithms";
import AIAlgorithms from "./pages/AIAlgorithms";

// Data Structure Visualizers
import ArrayVisualizer from "./pages/visualizers/ArrayVisualizer";
import LinkedListVisualizer from "./pages/visualizers/LinkedListVisualizer";
import StackVisualizer from "./pages/visualizers/StackVisualizer";
import QueueVisualizer from "./pages/visualizers/QueueVisualizer";
import DequeVisualizer from "./pages/visualizers/DequeVisualizer";
import BinaryTreeVisualizer from "./pages/visualizers/BinaryTreeVisualizer";
import BSTVisualizer from "./pages/visualizers/BSTVisualizer";
import GraphVisualizer from "./pages/visualizers/GraphVisualizer";

// Algorithm Visualizers
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
import ZeroOneKnapsackVisualizer from "./pages/visualizers/ZeroOneKnapsackVisualizer";
import JobSequencingVisualizer from "./pages/visualizers/JobSequencingVisualizer";

// CPU Scheduling Visualizers
import FCFSVisualizer from "./pages/visualizers/FCFSVisualizer";
import SJFVisualizer from "./pages/visualizers/SJFVisualizer";
import RoundRobinVisualizer from "./pages/visualizers/RoundRobinVisualizer";
import PriorityVisualizer from "./pages/visualizers/PriorityVisualizer";

// Page Replacement Visualizers
import FIFOVisualizer from "./pages/visualizers/FIFOVisualizer";
import LRUVisualizer from "./pages/visualizers/LRUVisualizer";
import OptimalVisualizer from "./pages/visualizers/OptimalVisualizer";
import MRUVisualizer from "./pages/visualizers/MRUVisualizer";

// Disk Scheduling Visualizers
import FCFSDiskVisualizer from "./pages/visualizers/FCFSDiskVisualizer";
import SSTFVisualizer from "./pages/visualizers/SSTFVisualizer";
import SCANVisualizer from "./pages/visualizers/SCANVisualizer";
import CSCANVisualizer from "./pages/visualizers/CSCANVisualizer";
import LOOKVisualizer from "./pages/visualizers/LOOKVisualizer";
import CLOOKVisualizer from "./pages/visualizers/CLOOKVisualizer";

// ECE Algorithm Visualizers
import FFTVisualizer from "./pages/visualizers/FFTVisualizer";
import ViterbiVisualizer from "./pages/visualizers/ViterbiVisualizer";
import KalmanVisualizer from "./pages/visualizers/KalmanVisualizer";
import TurboVisualizer from "./pages/visualizers/TurboVisualizer";
import LDPCVisualizer from "./pages/visualizers/LDPCVisualizer";
import ModulationVisualizer from "./pages/visualizers/ModulationVisualizer";

// AI Algorithm Visualizers
import CNNVisualizer from "./pages/visualizers/CNNVisualizer";
import RandomForestVisualizer from "./pages/visualizers/RandomForestVisualizer";
import DecisionTreeVisualizer from "./pages/visualizers/DecisionTreeVisualizer";
import KMeansVisualizer from "./pages/visualizers/KMeansVisualizer";
import LogisticRegressionVisualizer from "./pages/visualizers/LogisticRegressionVisualizer";
import HillClimbingVisualizer from "./pages/visualizers/HillClimbingVisualizer";
import AStarVisualizer from "./pages/visualizers/AStarVisualizer";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isInIframe } = useIframe();

  useEffect(() => {
    // Set iframe-specific styles and configurations
    if (isInIframe) {
      // Remove body margins and padding for seamless iframe integration
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'auto';
      
      // Add iframe-specific class for conditional styling
      document.body.classList.add('iframe-mode');
    }
  }, [isInIframe]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/auto-login" element={<AutoLogin />} />
        <Route path="/iframe" element={<IframeAuth />} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Index />} />
          
          {/* Main category pages */}
          <Route path="data-structures" element={<DataStructures />} />
          <Route path="algorithms" element={<Algorithms />} />
          <Route path="cpu-scheduling" element={<CPUScheduling />} />
          <Route path="page-replacement" element={<PageReplacement />} />
          <Route path="disk-scheduling" element={<DiskScheduling />} />
          <Route path="ece-algorithms" element={<ECEAlgorithms />} />
          <Route path="ai-algorithms" element={<AIAlgorithms />} />

          {/* Data Structure Visualizers */}
          <Route path="data-structures/array" element={<ArrayVisualizer />} />
          <Route path="data-structures/linked-list" element={<LinkedListVisualizer />} />
          <Route path="data-structures/stack" element={<StackVisualizer />} />
          <Route path="data-structures/queue" element={<QueueVisualizer />} />
          <Route path="data-structures/deque" element={<DequeVisualizer />} />
          <Route path="data-structures/binary-tree" element={<BinaryTreeVisualizer />} />
          <Route path="data-structures/bst" element={<BSTVisualizer />} />
          <Route path="data-structures/graph" element={<GraphVisualizer />} />

          {/* Algorithm Visualizers */}
          <Route path="algorithms/linear-search" element={<LinearSearchVisualizer />} />
          <Route path="algorithms/binary-search" element={<BinarySearchVisualizer />} />
          <Route path="algorithms/bubble-sort" element={<BubbleSortVisualizer />} />
          <Route path="algorithms/selection-sort" element={<SelectionSortVisualizer />} />
          <Route path="algorithms/insertion-sort" element={<InsertionSortVisualizer />} />
          <Route path="algorithms/merge-sort" element={<MergeSortVisualizer />} />
          <Route path="algorithms/quick-sort" element={<QuickSortVisualizer />} />
          <Route path="algorithms/tower-of-hanoi" element={<TowerOfHanoiVisualizer />} />
          <Route path="algorithms/n-queens" element={<NQueensVisualizer />} />
          <Route path="algorithms/fractional-knapsack" element={<FractionalKnapsackVisualizer />} />
          <Route path="algorithms/01-knapsack" element={<ZeroOneKnapsackVisualizer />} />
          <Route path="algorithms/job-sequencing" element={<JobSequencingVisualizer />} />

          {/* CPU Scheduling Visualizers */}
          <Route path="cpu-scheduling/fcfs" element={<FCFSVisualizer />} />
          <Route path="cpu-scheduling/sjf" element={<SJFVisualizer />} />
          <Route path="cpu-scheduling/round-robin" element={<RoundRobinVisualizer />} />
          <Route path="cpu-scheduling/priority" element={<PriorityVisualizer />} />

          {/* Page Replacement Visualizers */}
          <Route path="page-replacement/fifo" element={<FIFOVisualizer />} />
          <Route path="page-replacement/lru" element={<LRUVisualizer />} />
          <Route path="page-replacement/optimal" element={<OptimalVisualizer />} />
          <Route path="page-replacement/mru" element={<MRUVisualizer />} />

          {/* Disk Scheduling Visualizers */}
          <Route path="disk-scheduling/fcfs" element={<FCFSDiskVisualizer />} />
          <Route path="disk-scheduling/sstf" element={<SSTFVisualizer />} />
          <Route path="disk-scheduling/scan" element={<SCANVisualizer />} />
          <Route path="disk-scheduling/c-scan" element={<CSCANVisualizer />} />
          <Route path="disk-scheduling/look" element={<LOOKVisualizer />} />
          <Route path="disk-scheduling/c-look" element={<CLOOKVisualizer />} />

          {/* ECE Algorithm Visualizers */}
          <Route path="ece-algorithms/fft" element={<FFTVisualizer />} />
          <Route path="ece-algorithms/viterbi" element={<ViterbiVisualizer />} />
          <Route path="ece-algorithms/kalman" element={<KalmanVisualizer />} />
          <Route path="ece-algorithms/turbo" element={<TurboVisualizer />} />
          <Route path="ece-algorithms/ldpc" element={<LDPCVisualizer />} />
          <Route path="ece-algorithms/modulation" element={<ModulationVisualizer />} />

          {/* AI Algorithm Visualizers */}
          <Route path="ai-algorithms/cnn" element={<CNNVisualizer />} />
          <Route path="ai-algorithms/random-forest" element={<RandomForestVisualizer />} />
          <Route path="ai-algorithms/decision-tree" element={<DecisionTreeVisualizer />} />
          <Route path="ai-algorithms/kmeans" element={<KMeansVisualizer />} />
          <Route path="ai-algorithms/logistic-regression" element={<LogisticRegressionVisualizer />} />
          <Route path="ai-algorithms/hill-climbing" element={<HillClimbingVisualizer />} />
          <Route path="ai-algorithms/a-star" element={<AStarVisualizer />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
