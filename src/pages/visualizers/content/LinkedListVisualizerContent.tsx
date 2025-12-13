import React from "react";
import LinkedListToolbar from "../../visualizers/linked-list/LinkedListToolbar";
import LinkedListBoard from "../../visualizers/linked-list/LinkedListBoard";
import LinkedListActions from "../../visualizers/linked-list/LinkedListActions";
import LinkedListLogs from "../../visualizers/linked-list/LinkedListLogs";
import { useSinglyLinkedList } from "../../visualizers/linked-list/useSinglyLinkedList";

const LinkedListVisualizerContent = () => {
  const {
    state: {
      orderedNodes,
      logs,
      newElement,
      listSize,
      position,
      searchValue,
      isTraversing,
      lastOperation,
      operationTarget,
      highlightedArrow,
    },
    actions: {
      setNewElement,
      setListSize,
      setPosition,
      setSearchValue,
      insertAtHead,
      insertTail,
      insertAtPosition,
      deleteHead,
      deleteTail,
      deleteAtPosition,
      searchElement,
      reverseList,
      generateRandomList,
      clearList,
    },
  } = useSinglyLinkedList();

  return (
    <div>
      <div className="mb-6 md:mb-8 bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <LinkedListToolbar
          listSize={listSize}
          searchValue={searchValue}
          onListSizeChange={setListSize}
          onSearchChange={setSearchValue}
          onGenerate={generateRandomList}
          onSearch={searchElement}
          onReverse={reverseList}
          onClear={clearList}
        />

        <LinkedListBoard 
          orderedNodes={orderedNodes} 
          lastOperation={lastOperation} 
          operationTarget={operationTarget}
          highlightedArrow={highlightedArrow}
        />

        <LinkedListActions
          value={newElement}
          position={position}
          onValueChange={setNewElement}
          onPositionChange={setPosition}
          onInsertHead={insertAtHead}
          onInsertTail={insertTail}
          onInsertAtPosition={insertAtPosition}
          onDeleteHead={deleteHead}
          onDeleteTail={deleteTail}
          onDeleteAtPosition={deleteAtPosition}
        />

        <LinkedListLogs logs={logs} />
      </div>

      <div className="bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <h2 className="text-lg font-semibold mb-2 sm:text-xl text-foreground">About Singly Linked Lists</h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          A singly linked list is a linear data structure made of nodes, where each node stores data and a pointer to the
          next node. It allows efficient insertions and deletions at any position without shifting elements. However,
          accessing elements is slower since traversal must start from the head each time.
        </p>
      </div>
    </div>
  );
};

export default LinkedListVisualizerContent;
