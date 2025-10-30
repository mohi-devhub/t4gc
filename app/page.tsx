import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <Card className="p-8 flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome to the Y-Ultimate Management Platform</h1>
        <p className="mb-4 text-neutral-600">Digitized tournament and coaching management for your organization.</p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block bg-neutral-800 text-white font-semibold rounded px-5 py-3 hover:bg-neutral-950 transition"
        >
          Go to Dashboard
        </Link>
      </Card>
    </div>
  );
}
