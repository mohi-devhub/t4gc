"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Participant } from "./ParticipantsModule";
import FixtureGraph from "./FixtureGraph";

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

type FixtureGeneratorProps = {
  participants: Participant[];
  isEventHoster?: boolean;
};

export default function FixtureGenerator({ participants, isEventHoster = false }: FixtureGeneratorProps) {
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [fixtureGenerated, setFixtureGenerated] = useState(false);
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");

  // Get unique teams from participants
  const teams = useMemo(() => {
    const approvedParticipants = participants.filter(p => p.status === "Approved");
    const uniqueTeams = Array.from(new Set(approvedParticipants.map(p => p.team)));
    return uniqueTeams;
  }, [participants]);

  // Get team statistics
  const teamStats = useMemo(() => {
    return teams.map(team => {
      const teamMembers = participants.filter(p => p.team === team && p.status === "Approved");
      return {
        team,
        players: teamMembers.filter(p => p.role === "Player").length,
        coaches: teamMembers.filter(p => p.role === "Coach").length,
        volunteers: teamMembers.filter(p => p.role === "Volunteer").length,
        total: teamMembers.length,
      };
    });
  }, [teams, participants]);

  // Generate fixtures using round-robin algorithm
  const generateFixtures = (randomize: boolean = false) => {
    if (teams.length < 2) {
      toast("Not enough teams", { description: "You need at least 2 teams to generate fixtures." });
      return;
    }

    let teamsList = [...teams];
    
    // Randomize teams if requested
    if (randomize) {
      teamsList = teamsList.sort(() => Math.random() - 0.5);
      toast("Fixtures randomized!", { description: "Teams have been shuffled randomly." });
    }

    const matches: Match[] = [];
    let matchCounter = 1;

    // Round-robin algorithm
    const n = teamsList.length;
    const isOdd = n % 2 === 1;
    const totalTeams = isOdd ? n + 1 : n;
    const rounds = totalTeams - 1;
    const matchesPerRound = totalTeams / 2;

    // Create a working array with a "BYE" if odd number of teams
    const workingTeams = isOdd ? [...teamsList, "BYE"] : [...teamsList];

    for (let round = 0; round < rounds; round++) {
      for (let match = 0; match < matchesPerRound; match++) {
        const home = workingTeams[match];
        const away = workingTeams[totalTeams - 1 - match];

        // Skip matches involving BYE
        if (home !== "BYE" && away !== "BYE") {
          matches.push({
            id: `match-${matchCounter}`,
            team1: home,
            team2: away,
            round: round + 1,
            matchNumber: matchCounter,
            status: "pending",
          });
          matchCounter++;
        }
      }

      // Rotate teams (keep first team fixed, rotate others)
      workingTeams.splice(1, 0, workingTeams.pop()!);
    }

    setFixtures(matches);
    setFixtureGenerated(true);
    toast("Fixtures generated!", { 
      description: `${matches.length} matches created across ${rounds} rounds.` 
    });
  };

  const handleUpdateMatch = (matchId: string, result: { winner?: string; status: "pending" | "completed" | "tie"; score1?: number; score2?: number }) => {
    setFixtures(prev => 
      prev.map(match => 
        match.id === matchId ? { ...match, ...result } : match
      )
    );
  };

  // Chart data for team composition
  const teamCompositionData = useMemo(() => {
    if (teamStats.length === 0) return null;

    return {
      labels: teamStats.map(t => t.team),
      datasets: [
        {
          label: 'Players',
          data: teamStats.map(t => t.players),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        },
        {
          label: 'Coaches',
          data: teamStats.map(t => t.coaches),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
        },
        {
          label: 'Volunteers',
          data: teamStats.map(t => t.volunteers),
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          borderColor: 'rgba(245, 158, 11, 1)',
          borderWidth: 2,
        },
      ],
    };
  }, [teamStats]);

  // Chart data for role distribution
  const roleDistributionData = useMemo(() => {
    const approvedParticipants = participants.filter(p => p.status === "Approved");
    const players = approvedParticipants.filter(p => p.role === "Player").length;
    const coaches = approvedParticipants.filter(p => p.role === "Coach").length;
    const volunteers = approvedParticipants.filter(p => p.role === "Volunteer").length;

    return {
      labels: ['Players', 'Coaches', 'Volunteers'],
      datasets: [
        {
          data: [players, coaches, volunteers],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [participants]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: 'system-ui, -apple-system, sans-serif',
          },
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Team Composition',
        font: {
          size: 16,
          weight: 'bold' as const,
          family: 'system-ui, -apple-system, sans-serif',
        },
        padding: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
            family: 'system-ui, -apple-system, sans-serif',
          },
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Overall Role Distribution',
        font: {
          size: 16,
          weight: 'bold' as const,
          family: 'system-ui, -apple-system, sans-serif',
        },
        padding: 20,
      },
    },
  };

  // Group fixtures by round
  const fixturesByRound = useMemo(() => {
    const grouped: { [key: number]: Match[] } = {};
    fixtures.forEach(match => {
      if (!grouped[match.round]) {
        grouped[match.round] = [];
      }
      grouped[match.round].push(match);
    });
    return grouped;
  }, [fixtures]);

  return (
    <div className="space-y-6">
      {!isEventHoster && (
        <Card className="p-4 bg-amber-50 border-2 border-amber-600">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🔒</div>
            <div>
              <h3 className="font-bold text-amber-900">View Only Access</h3>
              <p className="text-sm text-amber-700">
                Only event hosters can generate fixtures. You can view the tournament schedule below.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fixture Generator</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isEventHoster 
              ? `Generate tournament fixtures from approved participants (${teams.length} teams available)`
              : `View tournament fixtures (${teams.length} teams participating)`
            }
          </p>
        </div>
        {isEventHoster && (
          <div className="flex gap-2">
            <Button 
              onClick={() => generateFixtures(false)}
              disabled={teams.length < 2}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
            >
              Generate Fixtures
            </Button>
            <Button 
              onClick={() => generateFixtures(true)}
              disabled={teams.length < 2}
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Randomize Fixtures
            </Button>
          </div>
        )}
      </div>

      {/* Fixtures Display */}
      {fixtureGenerated && fixtures.length > 0 && (
        <div className="space-y-4">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "graph" | "list")}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="graph">Graph View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="graph" className="mt-4">
              <FixtureGraph 
                fixtures={fixtures} 
                onUpdateMatch={handleUpdateMatch}
                isEventHoster={isEventHoster}
              />
            </TabsContent>

            <TabsContent value="list" className="mt-4">
              <Card className="p-6 shadow-lg border-2 border-blue-600">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Tournament Fixtures</h3>
                  <div className="text-sm text-gray-600">
                    {fixtures.length} total matches • {Object.keys(fixturesByRound).length} rounds
                  </div>
                </div>

                <div className="space-y-6">
                  {Object.keys(fixturesByRound)
                    .map(Number)
                    .sort((a, b) => a - b)
                    .map((roundNum) => (
                      <div key={roundNum} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-md">
                            Round {roundNum}
                          </div>
                          <div className="h-px flex-1 bg-gradient-to-r from-blue-300 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {fixturesByRound[roundNum].map((match) => {
                            const getStatusColor = () => {
                              if (match.status === "completed") return "border-l-green-500 bg-gradient-to-br from-green-50 to-white";
                              if (match.status === "tie") return "border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-white";
                              return "border-l-blue-500 bg-gradient-to-br from-white to-gray-50";
                            };

                            return (
                              <Card
                                key={match.id}
                                className={`p-4 hover:shadow-lg transition-all duration-300 border-l-4 ${getStatusColor()}`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-semibold text-gray-500">
                                    Match #{match.matchNumber}
                                  </span>
                                  <div className={`w-2 h-2 rounded-full ${
                                    match.status === "completed" ? "bg-green-500" : 
                                    match.status === "tie" ? "bg-yellow-500" : "bg-blue-500"
                                  } animate-pulse`} />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${match.winner === match.team1 ? "bg-green-600" : "bg-blue-600"}`} />
                                      <span className={`flex-1 ${match.winner === match.team1 ? "font-bold text-green-700" : "font-semibold text-gray-800"}`}>
                                        {match.team1}
                                      </span>
                                    </div>
                                    {match.score1 !== undefined && <span className="text-lg font-bold">{match.score1}</span>}
                                  </div>
                                  <div className="flex items-center justify-center text-gray-400 font-bold text-sm">
                                    VS
                                  </div>
                                  <div className="flex items-center gap-2 justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${match.winner === match.team2 ? "bg-green-600" : "bg-red-600"}`} />
                                      <span className={`flex-1 ${match.winner === match.team2 ? "font-bold text-green-700" : "font-semibold text-gray-800"}`}>
                                        {match.team2}
                                      </span>
                                    </div>
                                    {match.score2 !== undefined && <span className="text-lg font-bold">{match.score2}</span>}
                                  </div>
                                </div>
                                {match.status && (
                                  <div className="mt-2 flex justify-center">
                                    {match.status === "completed" && match.winner && (
                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                        Winner: {match.winner}
                                      </span>
                                    )}
                                    {match.status === "tie" && (
                                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                        Tie
                                      </span>
                                    )}
                                    {match.status === "pending" && (
                                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                        Pending
                                      </span>
                                    )}
                                  </div>
                                )}
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Export Button */}
                {isEventHoster && (
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => {
                        const data = fixtures.map(f => ({
                          Round: f.round,
                          Match: f.matchNumber,
                          Team1: f.team1,
                          Team2: f.team2,
                          Winner: f.winner || "",
                          Status: f.status || "pending",
                          Score1: f.score1 || "",
                          Score2: f.score2 || "",
                        }));
                        const csv = [
                          "Round,Match,Team 1,Team 2,Winner,Status,Score 1,Score 2",
                          ...data.map(d => `${d.Round},${d.Match},"${d.Team1}","${d.Team2}","${d.Winner}",${d.Status},${d.Score1},${d.Score2}`)
                        ].join("\n");
                        const blob = new Blob([csv], { type: "text/csv" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `fixtures-${new Date().toISOString().slice(0, 10)}.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                        toast("Fixtures exported", { description: "CSV file downloaded successfully." });
                      }}
                      variant="outline"
                      className="border-2 border-green-600 text-green-600 hover:bg-green-50"
                    >
                      Export Fixtures as CSV
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {fixtureGenerated && fixtures.length === 0 && (
        <Card className="p-8 text-center border-2 border-dashed">
          <p className="text-gray-500">No fixtures to display. Try generating fixtures with randomization.</p>
        </Card>
      )}

      {!fixtureGenerated && isEventHoster && (
        <Card className="p-12 text-center border-2 border-dashed bg-gradient-to-br from-blue-50 to-white">
          <div className="space-y-4">
            <div className="text-6xl">🏆</div>
            <h3 className="text-xl font-bold text-gray-800">Ready to Generate Fixtures?</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Click the button above to create a round-robin tournament schedule, 
              or randomize the fixtures for a different matchup order.
            </p>
          </div>
        </Card>
      )}

      {!fixtureGenerated && !isEventHoster && (
        <Card className="p-12 text-center border-2 border-dashed bg-gradient-to-br from-gray-50 to-white">
          <div className="space-y-4">
            <div className="text-6xl">📅</div>
            <h3 className="text-xl font-bold text-gray-800">No Fixtures Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              The tournament fixtures have not been generated yet. 
              Please check back later or contact the event organizer.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
