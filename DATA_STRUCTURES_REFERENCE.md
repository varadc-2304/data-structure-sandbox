# Data Structures Reference - Drona Platform

Complete list of all data structures and their available functions/operations in the project.

---

## 1. **Array**

**File:** `ArrayVisualizer.tsx`

### Functions:
- `appendElement()` - Add an element to the end of the array
- `replaceAtPosition()` - Replace an element at a specific position
- `deleteAtPosition()` - Remove an element from a specific position
- `viewAtPosition()` - View/access an element at a specific position
- `generateRandomArray()` - Generate a random array with specified size
- `clearArray()` - Clear all elements from the array

### Additional Features:
- Operation logs with timestamps
- Visual highlighting of operations
- Position-based operations (0-indexed)

---

## 2. **Linked List**

**File:** `LinkedListVisualizer.tsx`

### Functions:
- `appendElement()` - Add an element to the end of the linked list
- `removeAtPosition()` - Remove an element from a specific position (1-indexed)
- `viewAtPosition()` - View/access an element at a specific position
- `traverseList()` - Traverse the entire linked list
- `generateRandomList()` - Generate a random linked list with specified size
- `clearList()` - Clear all nodes from the linked list

### Additional Features:
- Node-based structure with pointers
- Visual representation of next pointers
- Traversal animation
- Position-based operations (1-indexed)

---

## 3. **Stack**

**File:** `StackVisualizer.tsx`

### Functions:
- `pushElement()` - Push an element onto the top of the stack
- `popElement()` - Pop/remove the top element from the stack
- `peekElement()` - View the top element without removing it
- `viewTopElement()` - Visualize the top element
- `generateRandomStack()` - Generate a random stack with specified size
- `clearStack()` - Clear all elements from the stack

### Additional Features:
- LIFO (Last-In-First-Out) principle visualization
- Stack underflow detection
- Visual highlighting of top element

---

## 4. **Queue**

**File:** `QueueVisualizer.tsx`

### Functions:
- `enqueueElement()` - Add an element to the rear/back of the queue
- `dequeueElement()` - Remove an element from the front of the queue
- `peekElement()` - View the front element without removing it
- `generateRandomQueue()` - Generate a random queue with specified size
- `clearQueue()` - Clear all elements from the queue

### Additional Features:
- FIFO (First-In-First-Out) principle visualization
- Queue underflow detection
- Visual representation of front and rear pointers

---

## 5. **Double-ended Queue (Deque)**

**File:** `DequeVisualizer.tsx`

### Functions:
- `addFront()` - Add an element to the front of the deque
- `addRear()` - Add an element to the rear of the deque
- `removeFront()` - Remove an element from the front of the deque
- `removeRear()` - Remove an element from the rear of the deque
- `peekFront()` - View the front element without removing it
- `peekRear()` - View the rear element without removing it
- `generateRandomDeque()` - Generate a random deque with specified size
- `clearDeque()` - Clear all elements from the deque

### Additional Features:
- Operations on both ends
- Visual indicators for front and rear
- Deque underflow detection

---

## 6. **Binary Tree**

**File:** `BinaryTreeVisualizer.tsx`

### Functions:
- `addNode()` - Add a new node to the tree
- `assignChild()` - Assign a child node to a parent (left or right)
- `deleteNode()` - Remove a node from the tree
- `startTraversal(type)` - Start tree traversal
  - `inorderTraversal()` - In-order traversal (Left → Root → Right)
  - `preorderTraversal()` - Pre-order traversal (Root → Left → Right)
  - `postorderTraversal()` - Post-order traversal (Left → Right → Root)
- `clearTree()` - Clear all nodes from the tree

### Additional Features:
- Manual tree construction
- Drag-and-drop node positioning
- Visual tree representation with SVG
- Step-by-step traversal animation
- Parent-child relationship assignment

---

## 7. **Binary Search Tree (BST)**

**File:** `BSTVisualizer.tsx`

### Functions:
- `addNode()` - Add a new node to the BST
- `assignChild()` - Assign a child node to a parent (with BST property validation)
- `deleteNode()` - Remove a node from the BST
- `startSearch()` - Search for a value in the BST
- `searchPath()` - Find the path to a value in the BST
- `startTraversal(type)` - Start tree traversal
  - `inorderTraversal()` - In-order traversal (gives sorted sequence)
  - `preorderTraversal()` - Pre-order traversal
  - `postorderTraversal()` - Post-order traversal
- `validateBSTProperty()` - Validate BST property (left < parent < right)
- `clearTree()` - Clear all nodes from the BST

### Additional Features:
- Automatic BST property validation
- Search visualization with path highlighting
- Duplicate value prevention
- Drag-and-drop node positioning
- Step-by-step traversal and search animations

---

## 8. **Graph**

**File:** `GraphVisualizer.tsx`

### Functions:
- `addNode()` - Add a new node/vertex to the graph
- `addEdge()` - Add an edge between two nodes (with optional weight)
- `removeNode()` - Remove a node and its associated edges
- `removeEdge()` - Remove an edge between two nodes
- `startTraversal(type)` - Start graph traversal
  - `bfsTraversal()` - Breadth-First Search traversal
  - `dfsTraversal()` - Depth-First Search traversal
- `clearGraph()` - Clear all nodes and edges from the graph

### Additional Features:
- Directed and undirected graph support
- Weighted edges
- Drag-and-drop node positioning
- Visual representation with SVG
- Step-by-step traversal animation
- Adjacency list representation

---

## Summary Table

| Data Structure | Insert | Delete | Search | Access | Traverse | Special Operations |
|---------------|--------|--------|--------|--------|----------|-------------------|
| **Array** | ✅ Append, Replace | ✅ Delete at position | ❌ | ✅ View at position | ❌ | Generate random, Clear |
| **Linked List** | ✅ Append | ✅ Remove at position | ❌ | ✅ View at position | ✅ Traverse | Generate random, Clear |
| **Stack** | ✅ Push | ✅ Pop | ❌ | ✅ Peek | ❌ | Generate random, Clear |
| **Queue** | ✅ Enqueue | ✅ Dequeue | ❌ | ✅ Peek | ❌ | Generate random, Clear |
| **Deque** | ✅ Add Front/Rear | ✅ Remove Front/Rear | ❌ | ✅ Peek Front/Rear | ❌ | Generate random, Clear |
| **Binary Tree** | ✅ Add Node | ✅ Delete Node | ❌ | ✅ | ✅ In/Pre/Post-order | Assign child, Clear |
| **BST** | ✅ Add Node | ✅ Delete Node | ✅ Search | ✅ | ✅ In/Pre/Post-order | Validate BST, Search path |
| **Graph** | ✅ Add Node/Edge | ✅ Remove Node/Edge | ❌ | ✅ | ✅ BFS, DFS | Weighted edges, Directed/Undirected |

---

## Common Features Across All Visualizers

1. **Operation Logs** - Timestamped logs of all operations
2. **Visual Highlighting** - Elements are highlighted during operations
3. **Toast Notifications** - User feedback for operations
4. **Random Generation** - Generate random data structures for testing
5. **Clear Function** - Reset the data structure to empty state
6. **Responsive Design** - Works on mobile and desktop
7. **Dark Mode Support** - Full dark/light mode compatibility

---

**Total Data Structures:** 8  
**Total Functions/Operations:** 50+

---

*Last Updated: 2025*








