import { useRef } from "react";
import { GraphNode, GraphEdge } from "./useGraphVisualizer";

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  traversalOrder: string[];
  currentTraversal: number;
  isTraversing: boolean;
  onMouseDown: (nodeId: string, event: React.MouseEvent) => void;
  svgRef: React.RefObject<SVGSVGElement>;
}

const GraphCanvas = ({ nodes, edges, traversalOrder, currentTraversal, isTraversing, onMouseDown, svgRef }: GraphCanvasProps) => {
  const getNodePosition = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const renderEdge = (edge: GraphEdge, index: number) => {
    const fromPos = getNodePosition(edge.from);
    const toPos = getNodePosition(edge.to);

    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const nodeRadius = 25;

    const offsetX = (dx / distance) * nodeRadius;
    const offsetY = (dy / distance) * nodeRadius;

    const startX = fromPos.x + offsetX;
    const startY = fromPos.y + offsetY;
    const endX = toPos.x - offsetX;
    const endY = toPos.y - offsetY;

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    return (
      <g key={index}>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#6B7280"
          strokeWidth="2"
          markerEnd={edge.directed ? "url(#arrowhead)" : undefined}
        />
        {edge.weight && <circle cx={midX} cy={midY} r="12" fill="white" stroke="#6B7280" strokeWidth="1" />}
        {edge.weight && (
          <text x={midX} y={midY + 4} textAnchor="middle" fontSize="10" fill="#374151">
            {edge.weight}
          </text>
        )}
      </g>
    );
  };

  const renderNode = (node: GraphNode) => {
    const isHighlighted = isTraversing && currentTraversal >= 0 && traversalOrder[currentTraversal] === node.id;

    return (
      <g key={node.id} style={{ cursor: "grab" }} onMouseDown={(e) => onMouseDown(node.id, e)}>
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
          className="font-medium"
          style={{ pointerEvents: "none" }}
        >
          {node.label}
        </text>
      </g>
    );
  };

  return (
    <div className="mb-6 relative">
      <div className="bg-arena-light rounded-lg p-4 overflow-hidden relative" style={{ minHeight: "400px" }}>
        <svg ref={svgRef} width="100%" height="400" className="border border-gray-200 rounded" style={{ userSelect: "none" }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
            </marker>
          </defs>

          {edges.map((edge, index) => renderEdge(edge, index))}
          {nodes.map((node) => renderNode(node))}
        </svg>

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-arena-gray">
            <span>Graph is empty. Add nodes and edges using the controls below.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphCanvas;
