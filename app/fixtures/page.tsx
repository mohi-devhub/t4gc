"use client";

import { Suspense, useState, useEffect } from "react";
import FixtureView from "@/components/participants/FixtureView";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data - in real app this would come from an API
const mockFixtures = [
  { id: "1", team1: "Blue Strikers", team2: "Red Raptors", round: 1, matchNumber: 1 },
  { id: "2", team1: "Green Warriors", team2: "Yellow Dragons", round: 1, matchNumber: 2 },
  { id: "3", team1: "Purple Knights", team2: "Orange Tigers", round: 1, matchNumber: 3 },
  { id: "4", team1: "Blue Strikers", team2: "Green Warriors", round: 2, matchNumber: 4 },
  { id: "5", team1: "Yellow Dragons", team2: "Red Raptors", round: 2, matchNumber: 5 },
  { id: "6", team1: "Orange Tigers", team2: "Purple Knights", round: 2, matchNumber: 6 },
  { id: "7", team1: "Blue Strikers", team2: "Yellow Dragons", round: 3, matchNumber: 7 },
  { id: "8", team1: "Red Raptors", team2: "Green Warriors", round: 3, matchNumber: 8 },
  { id: "9", team1: "Purple Knights", team2: "Orange Tigers", round: 3, matchNumber: 9 },
  { id: "10", team1: "Blue Strikers", team2: "Purple Knights", round: 4, matchNumber: 10 },
  { id: "11", team1: "Green Warriors", team2: "Orange Tigers", round: 4, matchNumber: 11 },
  { id: "12", team1: "Red Raptors", team2: "Yellow Dragons", round: 4, matchNumber: 12 },
  { id: "13", team1: "Blue Strikers", team2: "Orange Tigers", round: 5, matchNumber: 13 },
  { id: "14", team1: "Yellow Dragons", team2: "Purple Knights", round: 5, matchNumber: 14 },
  { id: "15", team1: "Green Warriors", team2: "Red Raptors", round: 5, matchNumber: 15 },
];

// Mock user team registrations - in real app this would come from user profile/API
const mockUserTeams = ["Blue Strikers", "Red Raptors", "Green Warriors"];

function FixturesContent() {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const isEventHoster = user?.role === "event-hoster";

  useEffect(() => {
    // Auto-select first team for normal users
    if (!isEventHoster && mockUserTeams.length > 0 && !selectedTeam) {
      setSelectedTeam(mockUserTeams[0]);
    }
  }, [isEventHoster, selectedTeam]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Fixtures</h1>
          <p className="text-muted-foreground mt-1">
            View your tournament schedule and upcoming matches
          </p>
        </div>
      </div>

      {!isEventHoster && mockUserTeams.length > 1 && (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <label htmlFor="team-select" className="font-medium">
              Select Team:
            </label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-64" id="team-select">
                <SelectValue placeholder="Choose a team..." />
              </SelectTrigger>
              <SelectContent>
                {mockUserTeams.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>
      )}

      {isEventHoster && (
        <Card className="p-4 bg-blue-50 border-2 border-blue-600">
          <div className="flex items-center gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <h3 className="font-bold text-blue-900">Event Hoster View</h3>
              <p className="text-sm text-blue-700">
                You're viewing all tournament fixtures. Go to the Participants → Fixtures tab to manage and generate fixtures.
              </p>
            </div>
          </div>
        </Card>
      )}

      <FixtureView 
        fixtures={mockFixtures} 
        userTeam={!isEventHoster ? selectedTeam : undefined}
      />
    </div>
  );
}

export default function FixturesPage() {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading fixtures...</div>}>
      <FixturesContent />
    </Suspense>
  );
}
