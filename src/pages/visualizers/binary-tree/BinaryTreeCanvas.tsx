import { TreeNode } from "./useBinaryTreeVisualizer";
import { useState } from "react";

interface BinaryTreeCanvasProps {
  nodes: TreeNode[];
  highlightedNode: string | null;
  onMouseDown: (nodeId: string, event: React.MouseEvent) => void;
  onDeleteNode?: (nodeId: string) => void;
  svgRef: React.RefObject<SVGSVGElement>;
}

const BinaryTreeCanvas = ({ nodes, highlightedNode, onMouseDown, onDeleteNode, svgRef }: BinaryTreeCanvasProps) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const renderEdge = (from: TreeNode, to: TreeNode) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const nodeRadius = 25;

    const offsetX = (dx / distance) * nodeRadius;
    const offsetY = (dy / distance) * nodeRadius;

    const startX = from.x + offsetX;
    const startY = from.y + offsetY;
    const endX = to.x - offsetX;
    const endY = to.y - offsetY;

    return (
      <line
        key={`${from.id}-${to.id}`}
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="#6B7280"
        strokeWidth="2"
        className="transition-all duration-300"
      />
    );
  };

  const renderNode = (node: TreeNode) => {
    const isHighlighted = highlightedNode === node.id;
    const isHovered = hoveredNode === node.id;
    const canDelete = onDeleteNode && !node.left && !node.right;

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDeleteNode && canDelete) {
        onDeleteNode(node.id);
      }
    };

    return (
      <g
        key={node.id}
        style={{ cursor: "grab" }}
        onMouseDown={(e) => onMouseDown(node.id, e)}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
      >
        <circle
          cx={node.x}
          cy={node.y}
          r="25"
          fill={isHighlighted ? "#628141" : "#F9FAFB"}
          stroke={isHighlighted ? "#628141" : "#6B7280"}
          strokeWidth="2"
          className="transition-all duration-300"
        />
        <text
          x={node.x}
          y={node.y + 4}
          textAnchor="middle"
          fontSize="12"
          fill={isHighlighted ? "white" : "#374151"}
          className="font-medium pointer-events-none"
        >
          {node.value}
        </text>
        {isHovered && canDelete && (
          <g
            onClick={handleDelete}
            style={{ cursor: "pointer" }}
            className="transition-all duration-200"
          >
            <circle
              cx={node.x + 18}
              cy={node.y - 18}
              r="10"
              fill="#ef4444"
              stroke="white"
              strokeWidth="1.5"
            />
            <text
              x={node.x + 18}
              y={node.y - 15}
              textAnchor="middle"
              fontSize="10"
              fill="white"
              className="pointer-events-none font-bold"
            >
              ×
            </text>
          </g>
        )}
      </g>
    );
  };

  return (
    <div className="mb-6 relative">
      <div className="bg-arena-light rounded-lg p-4 overflow-hidden relative" style={{ minHeight: "600px" }}>
        <svg ref={svgRef} width="100%" height="600" className="border border-gray-200 rounded" style={{ userSelect: "none" }}>
          {nodes.map((node) => {
            const edges = [];
            if (node.left) {
              const leftChild = nodes.find((n) => n.id === node.left);
              if (leftChild) edges.push(renderEdge(node, leftChild));
            }
            if (node.right) {
              const rightChild = nodes.find((n) => n.id === node.right);
              if (rightChild) edges.push(renderEdge(node, rightChild));
            }
            return edges;
          })}
          {nodes.map((node) => renderNode(node))}
        </svg>

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-arena-gray">
            <span>Tree is empty. Add nodes and assign relationships using the controls below.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BinaryTreeCanvas;
