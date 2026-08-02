"use client";

import { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";

import { graphNodes, graphEdges } from "@/lib/mockGraph";
import { CooperativeNode } from "@/components/graph/CooperativeNode";
import { GraphLegend } from "@/components/graph/GraphLegend";
import { NodeDetails } from "@/components/graph/NodeDetails";
import type { CooperativeNodeData } from "@/types/graph";

export default function GraphPage() {
  const [selectedNode, setSelectedNode] =
    useState<Node<CooperativeNodeData> | null>(null);

  // nodeTypes maps our custom string "cooperativeNode" to the actual component.
  // useMemo here isn't about performance so much as React Flow's own requirement:
  // this object must not be recreated on every render, or it re-mounts every node.
  const nodeTypes = useMemo(() => ({ cooperativeNode: CooperativeNode }), []);

  const handleNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    setSelectedNode(node as Node<CooperativeNodeData>);
  }, []);

  return (
    <main className="h-screen w-full bg-slate-950">
      <div className="relative h-full w-full">
        <ReactFlow
          nodes={graphNodes}
          edges={graphEdges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
        >
          <Background color="#1e293b" gap={20} />
          <Controls className="!bottom-4 !left-4" />
          <MiniMap
            className="!bottom-4 !right-4"
            maskColor="rgba(15, 23, 42, 0.7)"
            nodeColor="#334155"
          />
        </ReactFlow>

        <GraphLegend />

        {selectedNode && (
          <NodeDetails
            data={selectedNode.data}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </main>
  );
}