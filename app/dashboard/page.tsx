import ParticipantsModule from "@/components/participants/ParticipantsModule";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-neutral-600 mt-1">Overview and quick actions.</p>
      </Card>
      <ParticipantsModule />
    </div>
  );
}
