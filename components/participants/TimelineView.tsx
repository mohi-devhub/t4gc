"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { generateScheduleWithAI, TimelineEvent } from "@/lib/api/gemini";
import { Tournament } from "@/types/tournaments";

type Status = "completed" | "ongoing" | "upcoming";

const statusClasses: Record<Status, string> = {
  completed: "bg-blue-50 border-blue-100",
  ongoing: "bg-green-50 border-green-100",
  upcoming: "bg-red-50 border-red-100",
};

const statusBadge: Record<Status, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
  upcoming: "Upcoming",
};

interface TimelineViewProps {
  tournament?: Tournament;
}

export default function TimelineView({ tournament }: TimelineViewProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(true);

  const handleGenerateSchedule = async () => {
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!tournament) {
      toast.error("Tournament data not available");
      return;
    }

    setGenerating(true);
    try {
      const generatedEvents = await generateScheduleWithAI(description, {
        name: tournament.name,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        type: tournament.type,
        maxParticipants: tournament.maxParticipants,
      });
      
      setEvents(generatedEvents);
      setShowGenerator(false);
      toast.success("Schedule generated successfully!");
    } catch (error: any) {
      console.error("Error generating schedule:", error);
      toast.error(error.message || "Failed to generate schedule");
    } finally {
      setGenerating(false);
    }
  };

  const handleAddEvent = () => {
    const newEvent: TimelineEvent = {
      id: `event-${Date.now()}`,
      title: "New Event",
      description: "Event description",
      startDate: tournament?.startDate || new Date().toISOString().split('T')[0],
      endDate: tournament?.endDate || new Date().toISOString().split('T')[0],
      status: "upcoming",
    };
    setEvents([...events, newEvent]);
  };

  const handleRemoveEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {showGenerator ? (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Generate Schedule with AI</h3>
              <p className="text-sm text-neutral-600">
                Describe your tournament requirements and let AI generate a detailed schedule for you.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Schedule Description</label>
              <Textarea
                placeholder="E.g., We need a 3-day football tournament with morning and evening matches, lunch breaks, and an opening ceremony..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleGenerateSchedule}
                disabled={generating}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {generating ? "Generating..." : "Generate with AI"}
              </Button>
              <Button
                onClick={() => {
                  setShowGenerator(false);
                  setEvents([]);
                }}
                variant="outline"
              >
                Create Manually
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Tournament Schedule</h3>
          <div className="flex gap-2">
            <Button onClick={handleAddEvent} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
            <Button onClick={() => setShowGenerator(true)} variant="outline" size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Regenerate with AI
            </Button>
          </div>
        </div>
      )}

      {events.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <div className="relative pl-6">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-neutral-200" />
              <div className="space-y-4">
                {events.map((e, idx) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                    className="relative"
                  >
                    <div className="absolute -left-[7px] top-6 h-3 w-3 rounded-full bg-neutral-400" />
                    <Card className={`border ${statusClasses[e.status]} rounded-xl shadow-sm group`}>
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                              <div className="text-sm text-neutral-600">
                                <div className="font-medium text-neutral-800">
                                  {e.startDate} → {e.endDate}
                                </div>
                              </div>
                              <Badge variant="outline">{statusBadge[e.status]}</Badge>
                            </div>
                            <div>
                              <div className="text-base font-semibold text-neutral-900">{e.title}</div>
                              <p className="text-sm text-neutral-700 mt-1">{e.description}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEvent(e.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          {tournament && (
            <aside className="lg:sticky lg:top-6 h-fit">
              <Card className="rounded-xl shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <div>
                    <div className="text-sm text-neutral-500">Tournament</div>
                    <div className="text-lg font-semibold">{tournament.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Type</div>
                    <div className="font-medium">{tournament.type.replace(/_/g, ' ')}</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Duration</div>
                    <div className="font-medium">
                      {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500">Location</div>
                    <div className="font-medium">{tournament.location}</div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          )}
        </div>
      )}

      {!showGenerator && events.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-neutral-500">No events added yet. Click "Add Event" to create your schedule.</p>
        </Card>
      )}
    </div>
  );
}
