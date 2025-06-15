
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
import NotFound from "./pages/NotFound";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/auto-login" element={<AutoLogin />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            
            {/* Main category pages */}
            <Route path="/data-structures" element={<ProtectedRoute><DataStructures /></ProtectedRoute>} />
            <Route path="/algorithms" element={<ProtectedRoute><Algorithms /></ProtectedRoute>} />
            <Route path="/cpu-scheduling" element={<ProtectedRoute><CPUScheduling /></ProtectedRoute>} />
            <Route path="/page-replacement" element={<ProtectedRoute><PageReplacement /></ProtectedRoute>} />
            <Route path="/disk-scheduling" element={<ProtectedRoute><DiskScheduling /></ProtectedRoute>} />
            <Route path="/ece-algorithms" element={<ProtectedRoute><ECEAlgorithms /></ProtectedRoute>} />
            <Route path="/ai-algorithms" element={<ProtectedRoute><AIAlgorithms /></ProtectedRoute>} />

            {/* Data Structure Visualizers */}
            <Route path="/data-structures/array" element={<ProtectedRoute><ArrayVisualizer /></ProtectedRoute>} />
            <Route path="/data-structures/linked-list" element={<ProtectedRoute><LinkedListVisualizer /></ProtectedRoute>} />
            <Route path="/data-structures/stack" element={<ProtectedRoute><StackVisualizer /></ProtectedRoute>} />
            <Route path="/data-structures/queue" element={<ProtectedRoute><QueueVisualizer /></ProtectedRoute>} />
            <Route path="/data-structures/deque" element={<ProtectedRoute><DequeVisualizer /></ProtectedRoute>} />
            <Route path="/data-structures/binary-tree" element={<ProtectedRoute><BinaryTreeVisualizer /></ProtectedRoute>} />
            <Route path="/data-structures/bst" element={<ProtectedRoute><BSTVisualizer /></ProtectedRoute>} />
            <Route path="/data-structures/graph" element={<ProtectedRoute><GraphVisualizer /></ProtectedRoute>} />

            {/* Algorithm Visualizers */}
            <Route path="/algorithms/linear-search" element={<ProtectedRoute><LinearSearchVisualizer /></ProtectedRoute>} />
            <Route path="/algorithms/binary-search" element={<ProtectedRoute><BinarySearchVisualizer /></ProtectedRoute>} />
            <Route path="/algorithms/bubble-sort" element={<ProtectedRoute><BubbleSortVisualizer /></ProtectedRoute>} />
            <Route path="/algorithms/selection-sort" element={<ProtectedRoute><SelectionSortVisualizer /></ProtectedRoute>} />
            <Route path="/algorithms/insertion-sort" element={<ProtectedRoute><InsertionSortVisualizer /></ProtectedRoute>} />
            <Route path="/algorithms/merge-sort" element={<ProtectedRoute><MergeSortVisualizer /></ProtectedRoute>} />
            <Route path="/algorithms/quick-sort" element={<ProtectedRoute><QuickSortVisualizer /></ProtectedRoute>} />
            <Route path="/algorithms/tower-of-hanoi" element={<ProtectedRoute><TowerOfHanoiVisualizer /></ProtectedRoute>} />
            <Route path="/algorithms/n-queens" element={<ProtectedRoute><NQueensVisualizer /></ProtectedRoute>} />
            <Route path="/algorithms/fractional-knapsack" element={<ProtectedRoute><FractionalKnapsackVisualizer /></ProtectedRoute>} />
            <Route path="/algorithms/01-knapsack" element={<ProtectedRoute><ZeroOneKnapsackVisualizer /></ProtectedRoute>} />
            <Route path="/algorithms/job-sequencing" element={<ProtectedRoute><JobSequencingVisualizer /></ProtectedRoute>} />

            {/* CPU Scheduling Visualizers */}
            <Route path="/cpu-scheduling/fcfs" element={<ProtectedRoute><FCFSVisualizer /></ProtectedRoute>} />
            <Route path="/cpu-scheduling/sjf" element={<ProtectedRoute><SJFVisualizer /></ProtectedRoute>} />
            <Route path="/cpu-scheduling/round-robin" element={<ProtectedRoute><RoundRobinVisualizer /></ProtectedRoute>} />
            <Route path="/cpu-scheduling/priority" element={<ProtectedRoute><PriorityVisualizer /></ProtectedRoute>} />

            {/* Page Replacement Visualizers */}
            <Route path="/page-replacement/fifo" element={<ProtectedRoute><FIFOVisualizer /></ProtectedRoute>} />
            <Route path="/page-replacement/lru" element={<ProtectedRoute><LRUVisualizer /></ProtectedRoute>} />
            <Route path="/page-replacement/optimal" element={<ProtectedRoute><OptimalVisualizer /></ProtectedRoute>} />
            <Route path="/page-replacement/mru" element={<ProtectedRoute><MRUVisualizer /></ProtectedRoute>} />

            {/* Disk Scheduling Visualizers */}
            <Route path="/disk-scheduling/fcfs" element={<ProtectedRoute><FCFSDiskVisualizer /></ProtectedRoute>} />
            <Route path="/disk-scheduling/sstf" element={<ProtectedRoute><SSTFVisualizer /></ProtectedRoute>} />
            <Route path="/disk-scheduling/scan" element={<ProtectedRoute><SCANVisualizer /></ProtectedRoute>} />
            <Route path="/disk-scheduling/c-scan" element={<ProtectedRoute><CSCANVisualizer /></ProtectedRoute>} />
            <Route path="/disk-scheduling/look" element={<ProtectedRoute><LOOKVisualizer /></ProtectedRoute>} />
            <Route path="/disk-scheduling/c-look" element={<ProtectedRoute><CLOOKVisualizer /></ProtectedRoute>} />

            {/* ECE Algorithm Visualizers */}
            <Route path="/ece-algorithms/fft" element={<ProtectedRoute><FFTVisualizer /></ProtectedRoute>} />
            <Route path="/ece-algorithms/viterbi" element={<ProtectedRoute><ViterbiVisualizer /></ProtectedRoute>} />
            <Route path="/ece-algorithms/kalman" element={<ProtectedRoute><KalmanVisualizer /></ProtectedRoute>} />
            <Route path="/ece-algorithms/turbo" element={<ProtectedRoute><TurboVisualizer /></ProtectedRoute>} />
            <Route path="/ece-algorithms/ldpc" element={<ProtectedRoute><LDPCVisualizer /></ProtectedRoute>} />
            <Route path="/ece-algorithms/modulation" element={<ProtectedRoute><ModulationVisualizer /></ProtectedRoute>} />

            {/* AI Algorithm Visualizers */}
            <Route path="/ai-algorithms/cnn" element={<ProtectedRoute><CNNVisualizer /></ProtectedRoute>} />
            <Route path="/ai-algorithms/random-forest" element={<ProtectedRoute><RandomForestVisualizer /></ProtectedRoute>} />
            <Route path="/ai-algorithms/decision-tree" element={<ProtectedRoute><DecisionTreeVisualizer /></ProtectedRoute>} />
            <Route path="/ai-algorithms/kmeans" element={<ProtectedRoute><KMeansVisualizer /></ProtectedRoute>} />
            <Route path="/ai-algorithms/logistic-regression" element={<ProtectedRoute><LogisticRegressionVisualizer /></ProtectedRoute>} />
            <Route path="/ai-algorithms/hill-climbing" element={<ProtectedRoute><HillClimbingVisualizer /></ProtectedRoute>} />
            <Route path="/ai-algorithms/a-star" element={<ProtectedRoute><AStarVisualizer /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
