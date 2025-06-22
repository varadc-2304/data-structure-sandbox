
import { Brain, List, Cpu, Folder, HardDrive, Code, Zap } from 'lucide-react';

export interface NavigationItem {
  title: string;
  to: string;
  icon?: any;
  pathMatch: string;
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Quiz Me",
    to: "",
    icon: Brain,
    pathMatch: ""
  },
  {
    title: "Data Structures",
    to: "/data-structures",
    icon: List,
    pathMatch: "/data-structures"
  },
  {
    title: "CPU Scheduling",
    to: "/cpu-scheduling",
    icon: Cpu,
    pathMatch: "/cpu-scheduling"
  },
  {
    title: "Page Replacement",
    to: "/page-replacement",
    icon: Folder,
    pathMatch: "/page-replacement"
  },
  {
    title: "Disk Scheduling",
    to: "/disk-scheduling",
    icon: HardDrive,
    pathMatch: "/disk-scheduling"
  },
  {
    title: "Algorithms",
    to: "/algorithms",
    icon: Code,
    pathMatch: "/algorithms"
  },
  {
    title: "ECE Algorithms",
    to: "/ece-algorithms",
    icon: Zap,
    pathMatch: "/ece-algorithms"
  },
  {
    title: "AI Algorithms",
    to: "/ai-algorithms",
    icon: Brain,
    pathMatch: "/ai-algorithms"
  }
];
