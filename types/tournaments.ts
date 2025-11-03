export interface Tournament {
  id: number;
  name: string;
  description: string;
  type: TournamentType;
  status: TournamentStatus;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  createdAt: string;
  updatedAt: string;
}

export type TournamentType = 
  | 'SINGLE_ELIMINATION'
  | 'DOUBLE_ELIMINATION'
  | 'ROUND_ROBIN'
  | 'SWISS'
  | 'LEAGUE';

export type TournamentStatus = 
  | 'DRAFT'
  | 'UPCOMING'
  | 'ONGOING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface TournamentParticipant {
  id: number;
  tournamentId: number;
  name: string;
  email: string;
  teamName?: string;
  registeredAt: string;
}

export interface TournamentFixture {
  id: number;
  tournamentId: number;
  round: number;
  matchNumber: number;
  participant1?: TournamentParticipant;
  participant2?: TournamentParticipant;
  winner?: TournamentParticipant;
  scheduledTime: string;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  score1?: number;
  score2?: number;
}

export interface TournamentSchedule {
  id: number;
  tournamentId: number;
  date: string;
  time: string;
  venue: string;
  description: string;
  fixtures: TournamentFixture[];
}
