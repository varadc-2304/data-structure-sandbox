
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DataStructures from "./pages/DataStructures";
import ArrayVisualizer from "./pages/visualizers/ArrayVisualizer";
import LinkedListVisualizer from "./pages/visualizers/LinkedListVisualizer";
import StackVisualizer from "./pages/visualizers/StackVisualizer";
import QueueVisualizer from "./pages/visualizers/QueueVisualizer";
import DequeVisualizer from "./pages/visualizers/DequeVisualizer";
import BinaryTreeVisualizer from "./pages/visualizers/BinaryTreeVisualizer";
import BSTVisualizer from "./pages/visualizers/BSTVisualizer";
import GraphVisualizer from "./pages/visualizers/GraphVisualizer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/data-structures" element={<DataStructures />} />
          <Route path="/data-structures/array" element={<ArrayVisualizer />} />
          <Route path="/data-structures/linked-list" element={<LinkedListVisualizer />} />
          <Route path="/data-structures/stack" element={<StackVisualizer />} />
          <Route path="/data-structures/queue" element={<QueueVisualizer />} />
          <Route path="/data-structures/deque" element={<DequeVisualizer />} />
          <Route path="/data-structures/binary-tree" element={<BinaryTreeVisualizer />} />
          <Route path="/data-structures/bst" element={<BSTVisualizer />} />
          <Route path="/data-structures/graph" element={<GraphVisualizer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
