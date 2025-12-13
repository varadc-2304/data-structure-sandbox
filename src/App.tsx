
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import ExternalAuth from "./pages/ExternalAuth";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import Landing from "./pages/Landing";
import { useIframe } from "./hooks/useIframe";
import { useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";

// Main category pages
import DataStructures from "./pages/DataStructures";
import Algorithms from "./pages/Algorithms";
import CPUScheduling from "./pages/CPUScheduling";
import PageReplacement from "./pages/PageReplacement";
import DiskScheduling from "./pages/DiskScheduling";
import ECEAlgorithms from "./pages/ECEAlgorithms";
import AIAlgorithms from "./pages/AIAlgorithms";

// Data Structure Category Pages
import ArraysPage from "./pages/categories/ArraysPage";
import LinkedListsPage from "./pages/categories/LinkedListsPage";
import QueuesPage from "./pages/categories/QueuesPage";
import TreesPage from "./pages/categories/TreesPage";
import StacksPage from "./pages/categories/StacksPage";
import GraphsPage from "./pages/categories/GraphsPage";

// Data Structure Visualizers (kept for backward compatibility if needed)
import ArrayVisualizer from "./pages/visualizers/ArrayVisualizer";
import LinkedListVisualizer from "./pages/visualizers/LinkedListVisualizer";
import StackVisualizer from "./pages/visualizers/StackVisualizer";
import QueueVisualizer from "./pages/visualizers/QueueVisualizer";
import CircularQueueVisualizer from "./pages/visualizers/CircularQueueVisualizer";
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
        <ScrollToTop />
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/external-auth" element={<ExternalAuth />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<Index />} />
          
          {/* Main category pages */}
          <Route path="data-structures" element={<DataStructures />} />
          <Route path="algorithms" element={<Algorithms />} />
          <Route path="cpu-scheduling" element={<CPUScheduling />} />
          <Route path="page-replacement" element={<PageReplacement />} />
          <Route path="disk-scheduling" element={<DiskScheduling />} />
          <Route path="ece-algorithms" element={<ECEAlgorithms />} />
          <Route path="ai-algorithms" element={<AIAlgorithms />} />

          {/* Data Structure Category Pages (with tabs) */}
          <Route path="data-structures/arrays" element={<ArraysPage />} />
          <Route path="data-structures/linked-lists" element={<LinkedListsPage />} />
          <Route path="data-structures/linked-lists/:tab" element={<LinkedListsPage />} />
          {/* direct linked-list routes for deep links */}
          <Route path="data-structures/linked-list/:tab" element={<LinkedListsPage />} />
          <Route path="data-structures/queues" element={<QueuesPage />} />
          <Route path="data-structures/trees" element={<TreesPage />} />
          <Route path="data-structures/stacks" element={<StacksPage />} />
          <Route path="data-structures/graphs" element={<GraphsPage />} />

          {/* Legacy routes for backward compatibility */}
          <Route path="data-structures/array" element={<ArrayVisualizer />} />
          <Route path="data-structures/linked-list" element={<LinkedListVisualizer />} />
          <Route path="data-structures/stack" element={<StackVisualizer />} />
          <Route path="data-structures/queue" element={<QueueVisualizer />} />
          <Route path="data-structures/circular-queue" element={<CircularQueueVisualizer />} />
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
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
// This is for testing
export default App;
