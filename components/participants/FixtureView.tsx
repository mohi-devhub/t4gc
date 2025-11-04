"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";

type Match = {
  id: string;
  team1: string;
  team2: string;
  round: number;
  matchNumber: number;
};

type FixtureViewProps = {
  fixtures: Match[];
  userTeam?: string;
};

export default function FixtureView({ fixtures, userTeam }: FixtureViewProps) {
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

  // Filter matches involving user's team if specified
  const relevantMatches = useMemo(() => {
    if (!userTeam) return fixtures;
    return fixtures.filter(m => m.team1 === userTeam || m.team2 === userTeam);
  }, [fixtures, userTeam]);

  const isTeamMatch = (match: Match) => {
    if (!userTeam) return false;
    return match.team1 === userTeam || match.team2 === userTeam;
  };

  if (fixtures.length === 0) {
    return (
      <Card className="p-12 text-center border-2 border-dashed bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-neutral-900 dark:border-neutral-700">
        <div className="space-y-4">
          <div className="text-6xl">📅</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">No Fixtures Available</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Tournament fixtures have not been generated yet. Please check back later.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-neutral-100">Tournament Fixtures</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {fixtures.length} total matches • {Object.keys(fixturesByRound).length} rounds
            {userTeam && ` • Your team: ${userTeam}`}
          </p>
        </div>
      </div>

      {userTeam && relevantMatches.length > 0 && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-600 dark:border-blue-700">
          <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Your Matches</h3>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            You have {relevantMatches.length} match{relevantMatches.length !== 1 ? 'es' : ''} in this tournament.
            They are highlighted below.
          </p>
        </Card>
      )}

      <div className="space-y-6">
        {Object.keys(fixturesByRound)
          .map(Number)
          .sort((a, b) => a - b)
          .map((roundNum) => (
            <div key={roundNum} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white px-4 py-2 rounded-lg font-bold shadow-md">
                  Round {roundNum}
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-blue-300 dark:from-blue-800 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fixturesByRound[roundNum].map((match) => {
                  const highlighted = isTeamMatch(match);
                  return (
                    <Card
                      key={match.id}
                      className={`p-4 hover:shadow-lg transition-all duration-300 border-l-4 ${
                        highlighted 
                          ? 'border-l-yellow-500 dark:border-l-yellow-600 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/20 dark:to-neutral-900 shadow-md ring-2 ring-yellow-200 dark:ring-yellow-900' 
                          : 'border-l-green-500 dark:border-l-green-600 bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Match #{match.matchNumber}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${highlighted ? 'bg-yellow-500 dark:bg-yellow-600' : 'bg-green-500 dark:bg-green-600'} animate-pulse`} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${match.team1 === userTeam ? 'bg-yellow-600 dark:bg-yellow-500' : 'bg-blue-600 dark:bg-blue-500'}`} />
                          <span className={`font-semibold flex-1 ${match.team1 === userTeam ? 'text-yellow-900 dark:text-yellow-300' : 'text-gray-800 dark:text-gray-200'}`}>
                            {match.team1}
                          </span>
                        </div>
                        <div className="flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold text-sm">
                          VS
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${match.team2 === userTeam ? 'bg-yellow-600 dark:bg-yellow-500' : 'bg-red-600 dark:bg-red-500'}`} />
                          <span className={`font-semibold flex-1 ${match.team2 === userTeam ? 'text-yellow-900 dark:text-yellow-300' : 'text-gray-800 dark:text-gray-200'}`}>
                            {match.team2}
                          </span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
