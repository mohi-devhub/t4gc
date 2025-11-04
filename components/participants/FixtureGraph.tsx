"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
  MarkerType,
  ConnectionLineType,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trophy, Award, Minus } from "lucide-react";

type Match = {
  id: string;
  team1: string;
  team2: string;
  round: number;
  matchNumber: number;
  winner?: string;
  status?: "pending" | "completed" | "tie";
  score1?: number;
  score2?: number;
};

type FixtureGraphProps = {
  fixtures: Match[];
  onUpdateMatch?: (matchId: string, result: { winner?: string; status: "pending" | "completed" | "tie"; score1?: number; score2?: number }) => void;
  isEventHoster?: boolean;
};

// Custom node component for matches
function MatchNode({ data }: { data: any }) {
  const getStatusColor = () => {
    if (data.status === "completed") return "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600";
    if (data.status === "tie") return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-600";
    return "bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600";
  };

  const getStatusBadge = () => {
    if (data.status === "completed" && data.winner) {
      return <Badge className="bg-green-600 dark:bg-green-700 text-white text-xs">Winner: {data.winner}</Badge>;
    }
    if (data.status === "tie") {
      return <Badge className="bg-yellow-600 dark:bg-yellow-700 text-white text-xs">Tie</Badge>;
    }
    return <Badge variant="outline" className="text-xs border-neutral-300 dark:border-neutral-600">Pending</Badge>;
  };

  return (
    <>
      {/* React Flow Handles for connections */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#3b82f6',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#3b82f6',
          width: '12px',
          height: '12px',
          border: '2px solid white',
        }}
      />
      
      <div
        className={`${getStatusColor()} border-2 rounded-lg p-3 shadow-lg cursor-pointer hover:shadow-xl transition-all min-w-[200px]`}
        onClick={data.onClick}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Match #{data.matchNumber}</span>
          {data.status === "completed" && <Trophy className="w-4 h-4 text-green-600 dark:text-green-500" />}
        </div>
        <div className="space-y-2">
          <div className={`flex items-center justify-between ${data.winner === data.team1 ? 'font-bold text-green-700 dark:text-green-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
            <span className="text-sm">{data.team1}</span>
            {data.score1 !== undefined && <span className="text-lg font-bold">{data.score1}</span>}
          </div>
          <div className="text-center text-xs text-gray-400 dark:text-gray-500 font-bold">VS</div>
          <div className={`flex items-center justify-between ${data.winner === data.team2 ? 'font-bold text-green-700 dark:text-green-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
            <span className="text-sm">{data.team2}</span>
            {data.score2 !== undefined && <span className="text-lg font-bold">{data.score2}</span>}
          </div>
        </div>
        <div className="mt-2 flex justify-center">
          {getStatusBadge()}
        </div>
      </div>
    </>
  );
}

const nodeTypes = {
  matchNode: MatchNode,
};

export default function FixtureGraph({ fixtures, onUpdateMatch, isEventHoster = false }: FixtureGraphProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [score1, setScore1] = useState<number>(0);
  const [score2, setScore2] = useState<number>(0);
  const [matchesData, setMatchesData] = useState<Map<string, Match>>(
    new Map(fixtures.map(f => [f.id, f]))
  );

  // Generate nodes and edges from fixtures
  const { initialNodes, initialEdges } = useMemo(() => {
    const rounds = new Map<number, Match[]>();
    
    fixtures.forEach(match => {
      if (!rounds.has(match.round)) {
        rounds.set(match.round, []);
      }
      rounds.get(match.round)!.push(match);
    });

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const roundNumbers = Array.from(rounds.keys()).sort((a, b) => a - b);
    const horizontalSpacing = 400;
    const verticalSpacing = 180;

    roundNumbers.forEach((roundNum, roundIndex) => {
      const matches = rounds.get(roundNum)!;
      const roundHeight = matches.length * verticalSpacing;
      const startY = -roundHeight / 2;

      matches.forEach((match, matchIndex) => {
        const matchData = matchesData.get(match.id) || match;
        
        nodes.push({
          id: match.id,
          type: 'matchNode',
          position: {
            x: roundIndex * horizontalSpacing,
            y: startY + matchIndex * verticalSpacing,
          },
          data: {
            ...matchData,
            onClick: () => handleMatchClick(matchData),
          },
        });
      });
    });

    // Create edges showing team progression - separate loop to ensure all nodes exist
    roundNumbers.forEach((roundNum, roundIndex) => {
      if (roundIndex < roundNumbers.length - 1) {
        const currentRoundMatches = rounds.get(roundNum)!;
        const nextRoundMatches = rounds.get(roundNum + 1)!;
        
        currentRoundMatches.forEach(match => {
          const matchData = matchesData.get(match.id) || match;
          
          // For each team in current match, find where they play in next round
          [matchData.team1, matchData.team2].forEach(team => {
            const nextMatch = nextRoundMatches.find(m => 
              m.team1 === team || m.team2 === team
            );
            
            if (nextMatch) {
              const edgeId = `edge-${match.id}-to-${nextMatch.id}-${team}`;
              
              // Check if edge already exists
              const existingEdge = edges.find(e => e.id === edgeId);
              
              if (!existingEdge) {
                // Determine edge styling based on match status and winner
                const isWinningTeam = matchData.winner === team;
                const isCompleted = matchData.status === 'completed';
                
                let edgeStyle: any = {
                  stroke: '#6b7280',
                  strokeWidth: 3,
                };
                
                let animated = false;
                let label = undefined;
                
                if (isCompleted && isWinningTeam) {
                  edgeStyle = {
                    stroke: '#10b981',
                    strokeWidth: 4,
                  };
                  animated = true;
                  label = team;
                } else if (isCompleted && !isWinningTeam) {
                  // Skip creating edge for losing teams (eliminated)
                  return;
                } else if (matchData.status === 'tie') {
                  edgeStyle = {
                    stroke: '#eab308',
                    strokeWidth: 3,
                  };
                  animated = true;
                  label = 'Tie';
                }
                
                edges.push({
                  id: edgeId,
                  source: match.id,
                  target: nextMatch.id,
                  type: 'smoothstep',
                  animated: animated,
                  style: edgeStyle,
                  label: label,
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: edgeStyle.stroke,
                  },
                  labelStyle: label ? { 
                    fontSize: 10, 
                    fontWeight: 'bold',
                    fill: isCompleted && isWinningTeam ? '#10b981' : '#eab308',
                  } : undefined,
                  labelBgStyle: label ? {
                    fill: isCompleted && isWinningTeam ? '#f0fdf4' : '#fef9c3',
                  } : undefined,
                });
              }
            }
          });
        });
      }
    });

    console.log('Generated nodes:', nodes.length);
    console.log('Generated edges:', edges.length);
    console.log('Edges:', edges);

    return { initialNodes: nodes, initialEdges: edges };
  }, [fixtures, matchesData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleMatchClick = (match: Match) => {
    if (!isEventHoster) {
      toast("View only", { description: "Only event hosters can update match results." });
      return;
    }
    setSelectedMatch(match);
    setScore1(match.score1 || 0);
    setScore2(match.score2 || 0);
    setDialogOpen(true);
  };

  const handleSetWinner = (winner: string) => {
    if (!selectedMatch) return;

    const result = {
      winner,
      status: "completed" as const,
      score1,
      score2,
    };

    // Update local state
    const updatedMatch = { ...selectedMatch, ...result };
    setMatchesData(prev => new Map(prev).set(selectedMatch.id, updatedMatch));

    // Update nodes
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedMatch.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...result,
              onClick: () => handleMatchClick(updatedMatch),
            },
          };
        }
        return node;
      })
    );

    // Update edges to show winner progression only (remove loser edges)
    setEdges((eds) =>
      eds.filter((edge) => {
        // Keep edges that are not from the selected match
        if (edge.source !== selectedMatch.id) return true;
        
        // For edges from selected match, only keep winner's edge
        const edgeTeam = edge.id.split('-to-')[1]?.split('-').pop();
        return edgeTeam === winner;
      }).map((edge) => {
        if (edge.source === selectedMatch.id) {
          const edgeTeam = edge.id.split('-to-')[1]?.split('-').pop();
          const isWinner = edgeTeam === winner;
          const strokeColor = '#10b981';
          
          return {
            ...edge,
            animated: true,
            style: {
              stroke: strokeColor,
              strokeWidth: 4,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: strokeColor,
            },
            label: winner,
            labelStyle: { 
              fontSize: 10, 
              fontWeight: 'bold',
              fill: '#10b981',
            },
            labelBgStyle: {
              fill: '#f0fdf4',
            },
          };
        }
        return edge;
      })
    );

    if (onUpdateMatch) {
      onUpdateMatch(selectedMatch.id, result);
    }

    toast("Match updated!", { description: `${winner} won the match!` });
    setDialogOpen(false);
  };

  const handleSetTie = () => {
    if (!selectedMatch) return;

    const result = {
      winner: undefined,
      status: "tie" as const,
      score1,
      score2,
    };

    const updatedMatch = { ...selectedMatch, ...result };
    setMatchesData(prev => new Map(prev).set(selectedMatch.id, updatedMatch));

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedMatch.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...result,
              onClick: () => handleMatchClick(updatedMatch),
            },
          };
        }
        return node;
      })
    );

    // Update edges to show tie status - both teams continue with yellow color
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.source === selectedMatch.id) {
          return {
            ...edge,
            animated: true,
            style: { 
              stroke: '#eab308',
              strokeWidth: 3,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#eab308',
            },
            label: "Tie",
            labelStyle: { 
              fontSize: 10, 
              fontWeight: 'bold',
              fill: '#eab308',
            },
            labelBgStyle: {
              fill: '#fef9c3',
            },
          };
        }
        return edge;
      })
    );

    if (onUpdateMatch) {
      onUpdateMatch(selectedMatch.id, result);
    }

    toast("Match updated!", { description: "Match result set to tie." });
    setDialogOpen(false);
  };

  const handleResetMatch = () => {
    if (!selectedMatch) return;

    const result = {
      winner: undefined,
      status: "pending" as const,
      score1: undefined,
      score2: undefined,
    };

    const updatedMatch = { ...selectedMatch, ...result };
    setMatchesData(prev => new Map(prev).set(selectedMatch.id, updatedMatch));

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedMatch.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...result,
              onClick: () => handleMatchClick(updatedMatch),
            },
          };
        }
        return node;
      })
    );

    // Reset edges to default pending state
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.source === selectedMatch.id) {
          return {
            ...edge,
            animated: false,
            style: { 
              stroke: '#6b7280',
              strokeWidth: 3,
              strokeDasharray: undefined,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#6b7280',
            },
            label: undefined,
            labelStyle: undefined,
            labelBgStyle: undefined,
          };
        }
        return edge;
      })
    );

    if (onUpdateMatch) {
      onUpdateMatch(selectedMatch.id, result);
    }

    toast("Match reset", { description: "Match status reset to pending." });
    setDialogOpen(false);
  };

  const completedMatches = Array.from(matchesData.values()).filter(m => m.status === "completed").length;
  const totalMatches = fixtures.length;

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-600 dark:border-blue-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">Tournament Progress</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {completedMatches} of {totalMatches} matches completed ({Math.round((completedMatches / totalMatches) * 100)}%)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 transition-all duration-500"
            style={{ width: `${(completedMatches / totalMatches) * 100}%` }}
          />
        </div>
      </Card>

      <Card className="p-6 shadow-lg border-2 border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900" style={{ height: '600px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
            style: { strokeWidth: 3, stroke: '#6b7280' },
          }}
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Background color="#e5e7eb" gap={16} className="dark:opacity-20" />
          <Controls showInteractive={false} className="dark:bg-neutral-800 dark:border-neutral-700" />
          <MiniMap
            nodeColor={(node) => {
              const match = matchesData.get(node.id);
              if (match?.status === "completed") return "#10b981";
              if (match?.status === "tie") return "#eab308";
              return "#94a3b8";
            }}
            className="dark:bg-neutral-800 dark:border-neutral-700"
          />
          <Panel position="top-right" className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border dark:border-neutral-700">
            <div className="space-y-3">
              <div className="font-semibold text-sm border-b dark:border-neutral-700 pb-2 text-neutral-900 dark:text-neutral-100">Match Status</div>
              <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 dark:bg-green-600 rounded"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 dark:bg-yellow-600 rounded"></div>
                  <span>Tie</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <span>Pending</span>
                </div>
              </div>
              <div className="font-semibold text-sm border-b dark:border-neutral-700 pb-2 mt-3 text-neutral-900 dark:text-neutral-100">Connections</div>
              <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-green-500 dark:bg-green-600"></div>
                  <span>Winner Advances</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-yellow-500 dark:bg-yellow-600"></div>
                  <span>Both Advance (Tie)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-gray-500 dark:bg-gray-600"></div>
                  <span>Not Yet Played</span>
                </div>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </Card>

      {/* Match Result Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="dark:bg-neutral-900 dark:border-neutral-700">
          <DialogHeader>
            <DialogTitle className="dark:text-neutral-100">Update Match Result</DialogTitle>
            <DialogDescription className="dark:text-neutral-400">
              Set the winner and score for Match #{selectedMatch?.matchNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedMatch && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-neutral-200">{selectedMatch.team1} Score</label>
                  <input
                    type="number"
                    min="0"
                    value={score1}
                    onChange={(e) => setScore1(Number(e.target.value))}
                    className="w-full border rounded-md px-3 py-2 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-neutral-200">{selectedMatch.team2} Score</label>
                  <input
                    type="number"
                    min="0"
                    value={score2}
                    onChange={(e) => setScore2(Number(e.target.value))}
                    className="w-full border rounded-md px-3 py-2 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium dark:text-neutral-200">Set Winner:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleSetWinner(selectedMatch.team1)}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    {selectedMatch.team1}
                  </Button>
                  <Button
                    onClick={() => handleSetWinner(selectedMatch.team2)}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    {selectedMatch.team2}
                  </Button>
                </div>
                <Button
                  onClick={handleSetTie}
                  variant="outline"
                  className="w-full border-2 border-yellow-600 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-500 dark:hover:bg-yellow-950/30"
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Mark as Tie
                </Button>
              </div>

              <div className="pt-4 border-t dark:border-neutral-700">
                <Button
                  onClick={handleResetMatch}
                  variant="destructive"
                  className="w-full"
                >
                  Reset Match
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
