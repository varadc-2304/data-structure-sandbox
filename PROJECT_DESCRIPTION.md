# Drona - Interactive Computer Science Visualization Platform

## Overview

**Drona** is a comprehensive, interactive visualization platform designed to revolutionize computer science education. Built by **Ikshvaku Innovations**, Drona transforms abstract theoretical concepts into tangible, hands-on learning experiences through real-time visualizations, step-by-step animations, and interactive simulations.

## Mission

To make computer science education accessible, engaging, and effective by providing interactive tools that help learners visualize and understand complex algorithms, data structures, and system concepts through experiential learning.

## Key Features

### 🎯 Interactive Visualizations
- **Real-time Algorithm Execution**: Watch algorithms run step-by-step with visual feedback
- **Data Structure Manipulation**: Interact with data structures and see changes in real-time
- **Animated Explanations**: Step-through animations that break down complex processes
- **Performance Metrics**: View time complexity, space complexity, and execution statistics

### 📚 Comprehensive Coverage

#### Data Structures
- **Arrays**: Append, replace, delete, and view operations with position-based access
- **Linked Lists**: Single and doubly linked lists with traversal visualization
- **Stacks**: LIFO operations with push, pop, and peek
- **Queues**: FIFO operations including circular queues
- **Deques**: Double-ended queue operations
- **Trees**: Binary trees, BST, AVL trees with insertion, deletion, and traversal
- **Graphs**: Graph representation and traversal algorithms (BFS, DFS)

#### Algorithms
- **Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort
- **Searching Algorithms**: Linear Search, Binary Search
- **Optimization**: Fractional Knapsack, 0/1 Knapsack, Job Sequencing
- **AI/ML Algorithms**: K-Means Clustering, Decision Trees, Random Forest, CNN, Logistic Regression

#### Operating Systems Concepts
- **CPU Scheduling**: 
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF) - Preemptive and Non-preemptive
  - Round Robin with time quantum
  - Priority Scheduling
  - Interactive Gantt charts and performance metrics

- **Memory Management**:
  - FIFO (First-In-First-Out) Page Replacement
  - LRU (Least Recently Used) Page Replacement
  - MRU (Most Recently Used) Page Replacement
  - Page fault tracking and hit/miss visualization

- **Disk Scheduling**:
  - FCFS (First Come First Served)
  - SSTF (Shortest Seek Time First)
  - SCAN (Elevator Algorithm)
  - C-SCAN (Circular SCAN)
  - LOOK and C-LOOK algorithms
  - Seek time calculations and visualization

#### ECE Algorithms
- **Signal Processing**: FFT (Fast Fourier Transform)
- **Error Correction**: Turbo Codes, LDPC Codes, Viterbi Algorithm
- **Modulation**: Various modulation techniques
- **Kalman Filter**: State estimation and filtering

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** components for accessible UI elements
- **React Router** for navigation
- **Recharts** for data visualization

### Backend & Infrastructure
- **Supabase** for authentication and backend services
- **Edge Functions** for serverless operations
- **PostgreSQL** database
- **JWT** authentication

### Key Libraries
- **Lucide React** for icons
- **React Hook Form** for form management
- **Zod** for validation
- **Sonner** for toast notifications
- **Next Themes** for theme management

## Educational Approach

### Learn by Doing
Drona emphasizes hands-on learning where users can:
- **Manipulate** data structures directly
- **Observe** algorithm execution in real-time
- **Experiment** with different inputs and parameters
- **Understand** through visual feedback and step-by-step breakdowns

### Progressive Learning
- **Beginner-friendly**: Clear explanations and guided tutorials
- **Intermediate**: Interactive exercises and challenges
- **Advanced**: Complex algorithms with detailed analysis

### Comprehensive Documentation
- **Algorithm Explanations**: Detailed descriptions of how each algorithm works
- **Pseudocode**: Step-by-step algorithm representation
- **Time & Space Complexity**: Performance analysis for each algorithm
- **Use Cases**: Real-world applications and examples

## User Experience

### Intuitive Interface
- Clean, modern design with responsive layout
- Dark and light theme support
- Keyboard shortcuts for power users
- Mobile-friendly design

### Interactive Features
- **Play/Pause Controls**: Control algorithm execution speed
- **Step-by-step Navigation**: Move forward and backward through algorithm steps
- **Reset Functionality**: Start over with new inputs
- **Real-time Statistics**: View performance metrics as algorithms run

### Quiz System
- Interactive quizzes to test understanding
- AI-generated questions based on current topic
- Immediate feedback and explanations

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx      # Navigation bar
│   ├── Footer.tsx      # Footer component
│   ├── Hero.tsx        # Hero section
│   └── ...
├── pages/              # Page components
│   ├── visualizers/    # Algorithm visualizers
│   ├── categories/     # Category pages
│   └── ...
├── hooks/              # Custom React hooks
├── contexts/           # React contexts (Auth, Theme)
├── lib/                # Utility functions
├── integrations/       # External service integrations
└── utils/              # Helper utilities
```

## Key Visualizers

### Data Structures
- Array Visualizer
- Linked List Visualizer (Single & Doubly)
- Stack Visualizer
- Queue Visualizer (including Circular Queue)
- Deque Visualizer
- Tree Visualizers (Binary, BST, AVL)
- Graph Visualizer

### Algorithms
- Sorting Algorithm Visualizers
- Searching Algorithm Visualizers
- Optimization Problem Solvers
- AI/ML Algorithm Demonstrations

### Operating Systems
- CPU Scheduling Simulators with Gantt Charts
- Page Replacement Algorithm Visualizers
- Disk Scheduling Simulators

## Features for Educators

- **Embeddable Visualizations**: Visualizations can be embedded in iframes
- **Shareable Links**: Direct links to specific visualizations
- **No Registration Required**: Free access to all visualizations
- **Privacy-Focused**: No tracking, no ads, open source

## Open Source & Free

Drona is:
- **100% Free**: No cost, no subscriptions
- **Open Source**: Community-driven development
- **No Ads**: Clean, distraction-free learning experience
- **Privacy-Focused**: User data is not collected or tracked

## Development

### Getting Started
```bash
npm install
npm run dev
```

### Building
```bash
npm run build
```

### Tech Stack Highlights
- Modern React with TypeScript for type safety
- Vite for lightning-fast development
- Tailwind CSS for utility-first styling
- Supabase for backend services
- Component-based architecture for maintainability

## Future Enhancements

- Additional algorithm visualizations
- Collaborative learning features
- Export functionality for visualizations
- Mobile app version
- Offline mode support
- Multi-language support

## Contributing

Drona welcomes contributions from the community. Whether it's:
- Adding new algorithm visualizations
- Improving existing visualizations
- Fixing bugs
- Enhancing documentation
- UI/UX improvements

Your contributions help make computer science education more accessible to everyone.

## License

Open source - See LICENSE file for details

## Contact

- **Email**: support@drona.com
- **GitHub**: [Drona Repository]
- **Organization**: Ikshvaku Innovations

## Acknowledgments

Built with ❤️ in India by Ikshvaku Innovations. Drona aims to democratize computer science education and make learning algorithms and data structures accessible to students and educators worldwide.

---

**Drona** - Where Computer Science Concepts Come to Life 🚀

