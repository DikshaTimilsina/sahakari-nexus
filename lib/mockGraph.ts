import type { Node, Edge } from "reactflow";
import type { CooperativeNodeData, RelationshipEdgeData } from "@/types/graph";

export const graphNodes: Node<CooperativeNodeData>[] = [
  {
    id: "coop-1",
    position: { x: 250, y: 0 },
    data: {
      label: "Pokhara Valley Cooperative",
      healthScore: 78,
      memberCount: 1240,
      region: "Gandaki",
    },
    type: "cooperativeNode",
  },
  {
    id: "coop-2",
    position: { x: 0, y: 180 },
    data: {
      label: "Gandaki Farmers Union",
      healthScore: 65,
      memberCount: 860,
      region: "Gandaki",
    },
    type: "cooperativeNode",
  },
  {
    id: "coop-3",
    position: { x: 500, y: 180 },
    data: {
      label: "Lakeside Savings Group",
      healthScore: 71,
      memberCount: 540,
      region: "Gandaki",
    },
    type: "cooperativeNode",
  },
  {
    id: "coop-4",
    position: { x: 250, y: 360 },
    data: {
      label: "Himalaya Credit Cooperative",
      healthScore: 83,
      memberCount: 1980,
      region: "Bagmati",
    },
    type: "cooperativeNode",
  },
];

export const graphEdges: Edge<RelationshipEdgeData>[] = [
  {
    id: "e1-2",
    source: "coop-1",
    target: "coop-2",
    data: { type: "shared-members", strength: 0.6 },
    label: "Shared members",
  },
  {
    id: "e1-3",
    source: "coop-1",
    target: "coop-3",
    data: { type: "lending", strength: 0.8 },
    label: "Lending",
  },
  {
    id: "e1-4",
    source: "coop-1",
    target: "coop-4",
    data: { type: "regional", strength: 0.4 },
    label: "Regional",
  },
  {
    id: "e2-4",
    source: "coop-2",
    target: "coop-4",
    data: { type: "lending", strength: 0.5 },
    label: "Lending",
  },
];