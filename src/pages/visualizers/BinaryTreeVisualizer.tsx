import React from "react";
import BinaryTreeCanvas from "./binary-tree/BinaryTreeCanvas";
import BinaryTreeControls from "./binary-tree/BinaryTreeControls";
import BinaryTreeLogs from "./binary-tree/BinaryTreeLogs";
import { useBinaryTreeVisualizer } from "./binary-tree/useBinaryTreeVisualizer";

const BinaryTreeVisualizer = () => {
  const {
    state: {
      nodes,
      newValue,
      parentNode,
      childNode,
      childPosition,
      traversalOrder,
      currentTraversal,
      traversalType,
      isTraversing,
      logs,
      highlightedNode,
      svgRef,
    },
    actions: {
      setNewValue,
      setParentNode,
      setChildNode,
      setChildPosition,
      addNode,
      assignChild,
      deleteNode,
      clearTree,
      generateTree,
      startTraversal,
      resetTraversal,
      handleMouseDown,
    },
  } = useBinaryTreeVisualizer();

  return (
    <div>
      <div className="mb-6 md:mb-8 bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
          <BinaryTreeCanvas nodes={nodes} highlightedNode={highlightedNode} onMouseDown={handleMouseDown} onDeleteNode={deleteNode} svgRef={svgRef} />

          <BinaryTreeControls
            nodes={nodes}
            newValue={newValue}
            parentNode={parentNode}
            childNode={childNode}
            childPosition={childPosition}
            isTraversing={isTraversing}
            traversalType={traversalType}
            traversalOrder={traversalOrder}
            currentTraversal={currentTraversal}
            onNewValueChange={setNewValue}
            onParentNodeChange={setParentNode}
            onChildNodeChange={setChildNode}
            onChildPositionChange={setChildPosition}
            onAddNode={addNode}
            onAssignChild={assignChild}
            onClearTree={clearTree}
            onGenerateTree={generateTree}
            onStartInorder={() => startTraversal("inorder")}
            onStartPreorder={() => startTraversal("preorder")}
            onStartPostorder={() => startTraversal("postorder")}
            onResetTraversal={resetTraversal}
          />

          <BinaryTreeLogs logs={logs} />
        </div>

      <div className="bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <h2 className="text-lg font-semibold mb-2 sm:text-xl text-foreground">About Binary Trees</h2>
        <p className="text-sm text-muted-foreground sm:text-base mb-4">
          A binary tree is a hierarchical data structure where each node has at most two children. This visualizer enforces the BST property: 
          left child values must be smaller than the parent, and right child values must be larger than the parent. You can manually create the tree structure
          by adding nodes and assigning parent-child relationships.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Tree Operations:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Add nodes with any value</li>
              <li>Manually assign left/right children</li>
              <li>BST property enforced (left &lt; parent &lt; right)</li>
              <li>Drag nodes to reposition</li>
              <li>Visualize tree traversals</li>
            </ul>
          </div>
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Traversal Types:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Inorder: Left → Root → Right</li>
              <li>Preorder: Root → Left → Right</li>
              <li>Postorder: Left → Right → Root</li>
            </ul>
          </div>
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Usage Tips:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Add nodes first, then assign relationships</li>
              <li>Drag nodes to organize layout</li>
              <li>Each node can have at most 2 children</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinaryTreeVisualizer;
