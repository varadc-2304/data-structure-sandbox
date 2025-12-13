
import { List, Cpu, Folder, HardDrive, Code, Zap } from 'lucide-react';

export interface NavigationItem {
  title: string;
  to: string;
  icon?: any;
  pathMatch: string;
}

export const navigationItems: NavigationItem[] = [
//  {
  //  title: "Quiz Me",
    //to: "",
    //icon: Brain,
    //pathMatch: ""
  //},
  {
    title: "Data Structures",
    to: "/dashboard/data-structures",
    icon: List,
    pathMatch: "/dashboard/data-structures"
  },
  {
    title: "CPU Scheduling",
    to: "/dashboard/cpu-scheduling",
    icon: Cpu,
    pathMatch: "/dashboard/cpu-scheduling"
  },
  {
    title: "Page Replacement",
    to: "/dashboard/page-replacement",
    icon: Folder,
    pathMatch: "/dashboard/page-replacement"
  },
  {
    title: "Disk Scheduling",
    to: "/dashboard/disk-scheduling",
    icon: HardDrive,
    pathMatch: "/dashboard/disk-scheduling"
  },
  {
    title: "Algorithms",
    to: "/dashboard/algorithms",
    icon: Code,
    pathMatch: "/dashboard/algorithms"
  }
  // {
  //   title: "ECE Algorithms",
  //   to: "/dashboard/ece-algorithms",
  //   icon: Zap,
  //   pathMatch: "/dashboard/ece-algorithms"
  // },
];
