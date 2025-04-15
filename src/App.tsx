
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Auth from "@/pages/Auth";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DataStructures from "./pages/DataStructures";
import CPUScheduling from "./pages/CPUScheduling";
import PageReplacement from "./pages/PageReplacement";
import DiskScheduling from "./pages/DiskScheduling";
import Algorithms from "./pages/Algorithms";

// Data structure visualizers
import ArrayVisualizer from "./pages/visualizers/ArrayVisualizer";
import LinkedListVisualizer from "./pages/visualizers/LinkedListVisualizer";
import StackVisualizer from "./pages/visualizers/StackVisualizer";
import QueueVisualizer from "./pages/visualizers/QueueVisualizer";
import DequeVisualizer from "./pages/visualizers/DequeVisualizer";
import BinaryTreeVisualizer from "./pages/visualizers/BinaryTreeVisualizer";
import BSTVisualizer from "./pages/visualizers/BSTVisualizer";
import GraphVisualizer from "./pages/visualizers/GraphVisualizer";

// CPU scheduling visualizers
import FCFSVisualizer from "./pages/visualizers/FCFSVisualizer";
import SJFVisualizer from "./pages/visualizers/SJFVisualizer";
import PriorityVisualizer from "./pages/visualizers/PriorityVisualizer";
import RoundRobinVisualizer from "./pages/visualizers/RoundRobinVisualizer";

// Page replacement visualizers
import FIFOVisualizer from "./pages/visualizers/FIFOVisualizer";
import LRUVisualizer from "./pages/visualizers/LRUVisualizer";
import MRUVisualizer from "./pages/visualizers/MRUVisualizer";

// Disk scheduling visualizers
import FCFSDiskVisualizer from "./pages/visualizers/FCFSDiskVisualizer";
import SSTFVisualizer from "./pages/visualizers/SSTFVisualizer";
import SCANVisualizer from "./pages/visualizers/SCANVisualizer";
import CSCANVisualizer from "./pages/visualizers/CSCANVisualizer";
import LOOKVisualizer from "./pages/visualizers/LOOKVisualizer";
import CLOOKVisualizer from "./pages/visualizers/CLOOKVisualizer";

// Algorithm visualizers
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
 
            
            {/* Protected routes */}
            <Route path="/" element={
              
                <Index />
            
            } />
            
            {/* Data Structures */}
            <Route path="/data-structures" element={
              <ProtectedRoute>
                <DataStructures />
              </ProtectedRoute>
            } />
            <Route path="/data-structures/array" element={
              <ProtectedRoute>
                <ArrayVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/data-structures/linked-list" element={
              <ProtectedRoute>
                <LinkedListVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/data-structures/stack" element={
              <ProtectedRoute>
                <StackVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/data-structures/queue" element={
              <ProtectedRoute>
                <QueueVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/data-structures/deque" element={
              <ProtectedRoute>
                <DequeVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/data-structures/binary-tree" element={
              <ProtectedRoute>
                <BinaryTreeVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/data-structures/bst" element={
              <ProtectedRoute>
                <BSTVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/data-structures/graph" element={
              <ProtectedRoute>
                <GraphVisualizer />
              </ProtectedRoute>
            } />
            
            {/* CPU Scheduling */}
            <Route path="/cpu-scheduling" element={
              <ProtectedRoute>
                <CPUScheduling />
              </ProtectedRoute>
            } />
            <Route path="/cpu-scheduling/fcfs" element={
              <ProtectedRoute>
                <FCFSVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/cpu-scheduling/sjf" element={
              <ProtectedRoute>
                <SJFVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/cpu-scheduling/priority" element={
              <ProtectedRoute>
                <PriorityVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/cpu-scheduling/round-robin" element={
              <ProtectedRoute>
                <RoundRobinVisualizer />
              </ProtectedRoute>
            } />
            
            {/* Page Replacement */}
            <Route path="/page-replacement" element={
              <ProtectedRoute>
                <PageReplacement />
              </ProtectedRoute>
            } />
            <Route path="/page-replacement/fifo" element={
              <ProtectedRoute>
                <FIFOVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/page-replacement/lru" element={
              <ProtectedRoute>
                <LRUVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/page-replacement/mru" element={
              <ProtectedRoute>
                <MRUVisualizer />
              </ProtectedRoute>
            } />
            
            {/* Disk Scheduling */}
            <Route path="/disk-scheduling" element={
              <ProtectedRoute>
                <DiskScheduling />
              </ProtectedRoute>
            } />
            <Route path="/disk-scheduling/fcfs" element={
              <ProtectedRoute>
                <FCFSDiskVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/disk-scheduling/sstf" element={
              <ProtectedRoute>
                <SSTFVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/disk-scheduling/scan" element={
              <ProtectedRoute>
                <SCANVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/disk-scheduling/c-scan" element={
              <ProtectedRoute>
                <CSCANVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/disk-scheduling/look" element={
              <ProtectedRoute>
                <LOOKVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/disk-scheduling/c-look" element={
              <ProtectedRoute>
                <CLOOKVisualizer />
              </ProtectedRoute>
            } />
            
            {/* Algorithms */}
            <Route path="/algorithms" element={
              <ProtectedRoute>
                <Algorithms />
              </ProtectedRoute>
            } />
            <Route path="/algorithms/linear-search" element={
              <ProtectedRoute>
                <LinearSearchVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/algorithms/binary-search" element={
              <ProtectedRoute>
                <BinarySearchVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/algorithms/bubble-sort" element={
              <ProtectedRoute>
                <BubbleSortVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/algorithms/selection-sort" element={
              <ProtectedRoute>
                <SelectionSortVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/algorithms/insertion-sort" element={
              <ProtectedRoute>
                <InsertionSortVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/algorithms/merge-sort" element={
              <ProtectedRoute>
                <MergeSortVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/algorithms/quick-sort" element={
              <ProtectedRoute>
                <QuickSortVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/algorithms/tower-of-hanoi" element={
              <ProtectedRoute>
                <TowerOfHanoiVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/algorithms/n-queens" element={
              <ProtectedRoute>
                <NQueensVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/algorithms/fractional-knapsack" element={
              <ProtectedRoute>
                <FractionalKnapsackVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/algorithms/job-sequencing" element={
              <ProtectedRoute>
                <JobSequencingVisualizer />
              </ProtectedRoute>
            } />
            <Route path="/algorithms/0-1-knapsack" element={
              <ProtectedRoute>
                <ZeroOneKnapsackVisualizer />
              </ProtectedRoute>
            } />
            
            {/* Redirect to auth if trying to access unknown page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
