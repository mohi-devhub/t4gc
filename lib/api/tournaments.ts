import { Tournament, TournamentParticipant, TournamentFixture, TournamentSchedule } from '@/types/tournaments';

// Mock data storage
let mockTournaments: Tournament[] = [
  {
    id: 1,
    name: 'Summer Championship 2024',
    description: 'Annual summer tournament for all skill levels',
    type: 'SINGLE_ELIMINATION',
    status: 'UPCOMING',
    startDate: '2024-06-15',
    endDate: '2024-06-20',
    location: 'Central Sports Arena',
    maxParticipants: 32,
    currentParticipants: 24,
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-05-15T14:30:00Z',
  },
  {
    id: 2,
    name: 'Winter League',
    description: 'Round-robin winter league tournament',
    type: 'ROUND_ROBIN',
    status: 'ONGOING',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    location: 'Indoor Stadium',
    maxParticipants: 16,
    currentParticipants: 16,
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: '2024-12-01T08:00:00Z',
  },
];

let mockParticipants: TournamentParticipant[] = [
  {
    id: 1,
    tournamentId: 1,
    name: 'John Doe',
    email: 'john@example.com',
    teamName: 'Warriors',
    registeredAt: '2024-05-05T10:00:00Z',
  },
  {
    id: 2,
    tournamentId: 1,
    name: 'Jane Smith',
    email: 'jane@example.com',
    teamName: 'Champions',
    registeredAt: '2024-05-06T11:00:00Z',
  },
];

let mockFixtures: TournamentFixture[] = [
  {
    id: 1,
    tournamentId: 1,
    round: 1,
    matchNumber: 1,
    participant1: mockParticipants[0],
    participant2: mockParticipants[1],
    scheduledTime: '2024-06-15T14:00:00Z',
    status: 'SCHEDULED',
  },
];

let mockSchedules: TournamentSchedule[] = [
  {
    id: 1,
    tournamentId: 1,
    date: '2024-06-15',
    time: '14:00',
    venue: 'Main Court',
    description: 'Round 1 matches',
    fixtures: [mockFixtures[0]],
  },
];

let nextId = mockTournaments.length + 1;

// Tournament APIs (mock)
export const getAllTournaments = async (): Promise<{ data: Tournament[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: [...mockTournaments] });
    }, 300);
  });
};

export const getTournament = async (id: number): Promise<{ data: Tournament }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tournament = mockTournaments.find(t => t.id === id);
      if (tournament) {
        resolve({ data: tournament });
      } else {
        reject(new Error('Tournament not found'));
      }
    }, 200);
  });
};

export const createTournament = async (tournament: Partial<Tournament>): Promise<{ data: Tournament }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTournament: Tournament = {
        id: nextId++,
        name: tournament.name || '',
        description: tournament.description || '',
        type: tournament.type || 'SINGLE_ELIMINATION',
        status: tournament.status || 'DRAFT',
        startDate: tournament.startDate || '',
        endDate: tournament.endDate || '',
        location: tournament.location || '',
        maxParticipants: tournament.maxParticipants || 16,
        currentParticipants: tournament.currentParticipants || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockTournaments.push(newTournament);
      resolve({ data: newTournament });
    }, 300);
  });
};

export const updateTournament = async (id: number, tournament: Partial<Tournament>): Promise<{ data: Tournament }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTournaments.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTournaments[index] = {
          ...mockTournaments[index],
          ...tournament,
          updatedAt: new Date().toISOString(),
        };
        resolve({ data: mockTournaments[index] });
      } else {
        reject(new Error('Tournament not found'));
      }
    }, 300);
  });
};

export const deleteTournament = async (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockTournaments = mockTournaments.filter(t => t.id !== id);
      resolve();
    }, 200);
  });
};

// Participant APIs
export const getTournamentParticipants = async (tournamentId: number): Promise<{ data: TournamentParticipant[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const participants = mockParticipants.filter(p => p.tournamentId === tournamentId);
      resolve({ data: participants });
    }, 200);
  });
};

// Fixture APIs
export const getTournamentFixtures = async (tournamentId: number): Promise<{ data: TournamentFixture[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fixtures = mockFixtures.filter(f => f.tournamentId === tournamentId);
      resolve({ data: fixtures });
    }, 200);
  });
};

// Schedule APIs
export const getTournamentSchedules = async (tournamentId: number): Promise<{ data: TournamentSchedule[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const schedules = mockSchedules.filter(s => s.tournamentId === tournamentId);
      resolve({ data: schedules });
    }, 200);
  });
};
