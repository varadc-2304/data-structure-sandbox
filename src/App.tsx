import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AutoLogin from "./pages/AutoLogin";
import DataStructures from "./pages/DataStructures";
import Algorithms from "./pages/Algorithms";
import CPUScheduling from "./pages/CPUScheduling";
import DiskScheduling from "./pages/DiskScheduling";
import PageReplacement from "./pages/PageReplacement";
import NotFound from "./pages/NotFound";
import {
  ArrayVisualizer,
  LinkedListVisualizer,
  QueueVisualizer,
  StackVisualizer,
  BinaryTreeVisualizer,
} from "./components/Visualizer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/auto-login" element={<AutoLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/data-structures" element={<DataStructures />} />
              <Route path="/algorithms" element={<Algorithms />} />
              <Route path="/cpu-scheduling" element={<CPUScheduling />} />
              <Route path="/disk-scheduling" element={<DiskScheduling />} />
              <Route path="/page-replacement" element={<PageReplacement />} />
              
              <Route
                path="/visualizer/array"
                element={<ArrayVisualizer />}
              />
              <Route
                path="/visualizer/linked-list"
                element={<LinkedListVisualizer />}
              />
              <Route
                path="/visualizer/queue"
                element={<QueueVisualizer />}
              />
              <Route
                path="/visualizer/stack"
                element={<StackVisualizer />}
              />
              <Route
                path="/visualizer/binary-tree"
                element={<BinaryTreeVisualizer />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
