// Test script to check edge generation logic
const fixtures = [
  { id: "match-1", team1: "Blue Strikers", team2: "Red Raptors", round: 1, matchNumber: 1, status: "pending" },
  { id: "match-2", team1: "Green Warriors", team2: "Yellow Dragons", round: 1, matchNumber: 2, status: "pending" },
  { id: "match-3", team1: "Purple Knights", team2: "Orange Tigers", round: 1, matchNumber: 3, status: "pending" },
  { id: "match-4", team1: "Blue Strikers", team2: "Green Warriors", round: 2, matchNumber: 4, status: "pending" },
  { id: "match-5", team1: "Yellow Dragons", team2: "Red Raptors", round: 2, matchNumber: 5, status: "pending" },
  { id: "match-6", team1: "Orange Tigers", team2: "Purple Knights", round: 2, matchNumber: 6, status: "pending" },
];

const rounds = new Map();
fixtures.forEach(match => {
  if (!rounds.has(match.round)) {
    rounds.set(match.round, []);
  }
  rounds.get(match.round).push(match);
});

const edges = [];
const roundNumbers = Array.from(rounds.keys()).sort((a, b) => a - b);

roundNumbers.forEach((roundNum, roundIndex) => {
  if (roundIndex < roundNumbers.length - 1) {
    const currentRoundMatches = rounds.get(roundNum);
    const nextRoundMatches = rounds.get(roundNum + 1);
    
    currentRoundMatches.forEach(match => {
      [match.team1, match.team2].forEach(team => {
        const nextMatch = nextRoundMatches.find(m => 
          m.team1 === team || m.team2 === team
        );
        
        if (nextMatch) {
          const edgeId = `edge-${match.id}-to-${nextMatch.id}-${team}`;
          console.log(`Creating edge: ${edgeId}`);
          console.log(`  From: ${match.id} (${match.team1} vs ${match.team2})`);
          console.log(`  To: ${nextMatch.id} (${nextMatch.team1} vs ${nextMatch.team2})`);
          console.log(`  Team: ${team}`);
          edges.push({ id: edgeId, source: match.id, target: nextMatch.id, team });
        } else {
          console.log(`No next match found for team ${team} from ${match.id}`);
        }
      });
    });
  }
});

console.log('\nTotal edges created:', edges.length);
console.log('\nEdges:', JSON.stringify(edges, null, 2));
