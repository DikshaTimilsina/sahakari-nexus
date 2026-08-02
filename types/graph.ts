export type RelationshipType = "lending" | "shared-members" | "regional";

export interface CooperativeNodeData {
  label: string;
  healthScore: number;
  memberCount: number;
  region: string;
}

export interface RelationshipEdgeData {
  type: RelationshipType;
  strength: number;
}