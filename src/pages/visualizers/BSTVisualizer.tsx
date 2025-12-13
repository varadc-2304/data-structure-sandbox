import React from "react";
import BSTCanvas from "./bst/BSTCanvas";
import BSTControls from "./bst/BSTControls";
import BSTLogs from "./bst/BSTLogs";
import { useBSTVisualizer } from "./bst/useBSTVisualizer";

const BSTVisualizer = () => {
  const {
    state: { nodes, newValue, parentNode, childNode, childPosition, searchValue, traversalOrder, currentTraversal, traversalType, isTraversing, logs, highlightedNode, svgRef },
    actions: { setNewValue, setParentNode, setChildNode, setChildPosition, setSearchValue, addNode, assignChild, deleteNode, handleMouseDown, startTraversal, startSearch, resetTraversal, clearTree, generateTree },
  } = useBSTVisualizer();

  return (
    <div>
      <div className="mb-6 md:mb-8 bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <BSTCanvas nodes={nodes} highlightedNode={highlightedNode} onMouseDown={handleMouseDown} onDeleteNode={deleteNode} svgRef={svgRef} />

        <BSTControls
          nodes={nodes}
          newValue={newValue}
          parentNode={parentNode}
          childNode={childNode}
          childPosition={childPosition}
          searchValue={searchValue}
          isTraversing={isTraversing}
          traversalType={traversalType}
          traversalOrder={traversalOrder}
          currentTraversal={currentTraversal}
          onNewValueChange={setNewValue}
          onParentNodeChange={setParentNode}
          onChildNodeChange={setChildNode}
          onChildPositionChange={setChildPosition}
          onSearchValueChange={setSearchValue}
          onAddNode={addNode}
          onAssignChild={assignChild}
          onStartSearch={startSearch}
          onClearTree={clearTree}
          onGenerateTree={generateTree}
          onStartInorder={() => startTraversal("inorder")}
          onStartPreorder={() => startTraversal("preorder")}
          onStartPostorder={() => startTraversal("postorder")}
          onResetTraversal={resetTraversal}
        />

        <BSTLogs logs={logs} />
      </div>

      <div className="bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <h2 className="text-lg font-semibold mb-2 sm:text-xl text-foreground">About Binary Search Trees</h2>
        <p className="text-sm text-muted-foreground sm:text-base mb-4">A BST is a binary tree where for each node: all values in the left subtree are smaller, and all values in the right subtree are larger than the node's value.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">BST Properties:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Left subtree values &lt; root</li>
              <li>Right subtree values &gt; root</li>
              <li>Inorder gives sorted sequence</li>
              <li>No duplicate values allowed</li>
            </ul>
          </div>
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Manual Construction:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Add nodes with unique values</li>
              <li>Manually assign parent-child relationships</li>
              <li>BST property validation enforced</li>
              <li>Drag nodes to organize layout</li>
            </ul>
          </div>
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Operations:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Search: O(log n) average case</li>
              <li>Traversals: Inorder, Preorder, Postorder</li>
              <li>Interactive node positioning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BSTVisualizer;
