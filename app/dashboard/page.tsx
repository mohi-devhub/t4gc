"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Trophy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getAllTournaments } from "@/lib/api/tournaments";
import { Tournament } from "@/types/tournaments";
import { useAuth } from "@/lib/auth-context";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'UPCOMING': return 'bg-blue-100 text-blue-800';
    case 'ONGOING': return 'bg-green-100 text-green-800';
    case 'COMPLETED': return 'bg-gray-100 text-gray-800';
    case 'CANCELLED': return 'bg-red-100 text-red-800';
    default: return 'bg-yellow-100 text-yellow-800';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'SINGLE_ELIMINATION': return 'Single Elimination';
    case 'DOUBLE_ELIMINATION': return 'Double Elimination';
    case 'ROUND_ROBIN': return 'Round Robin';
    case 'SWISS': return 'Swiss';
    case 'LEAGUE': return 'League';
    default: return type;
  }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isEventHoster = user?.role === "event-hoster";

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const response = await getAllTournaments();
      
      // For normal users, show only registered tournaments (mock - you can add registration logic)
      // For event hosters, show all tournaments
      if (isEventHoster) {
        setTournaments(response.data);
      } else {
        // Mock registered tournaments - filter to show only tournaments with UPCOMING or ONGOING status
        // In real implementation, this would check user's registration status
        const registeredTournaments = response.data.filter(t => 
          t.status === 'UPCOMING' || t.status === 'ONGOING'
        );
        setTournaments(registeredTournaments);
      }
    } catch (error) {
      console.error('Error loading tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-neutral-600 mt-1">Loading tournaments...</p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tournaments</h1>
        <p className="text-neutral-600 mt-1">
          {tournaments.length > 0 
            ? `${tournaments.length} tournament${tournaments.length > 1 ? 's' : ''} available` 
            : 'No tournaments created yet'}
        </p>
      </div>
      
      {tournaments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Trophy className="h-16 w-16 text-neutral-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Tournaments Yet</h3>
            <p className="text-neutral-600 mb-6">Create your first tournament to get started</p>
            <Link 
              href="/tournaments/create"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create Tournament
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Link key={tournament.id} href={`/tournaments/${tournament.id}`} className="block group">
              <motion.div 
                whileHover={{ y: -2, scale: 1.02 }} 
                whileTap={{ scale: 0.99 }} 
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="rounded-2xl h-full border-neutral-200/70 overflow-hidden transition-all duration-200 group-hover:shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-white to-neutral-50 group-hover:from-neutral-50 group-hover:to-white">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg line-clamp-1">{tournament.name}</CardTitle>
                      <Badge className={getStatusColor(tournament.status)} variant="secondary">
                        {tournament.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {tournament.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center text-sm text-neutral-600">
                      <Trophy className="h-4 w-4 mr-2" />
                      {getTypeLabel(tournament.type)}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {tournament.location}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <Users className="h-4 w-4 mr-2" />
                      {tournament.currentParticipants}/{tournament.maxParticipants} participants
                    </div>
                    <div className="pt-2 flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
