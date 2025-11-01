"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { GalleryGrid, type GalleryImage } from "@/components/gallery/GalleryGrid";
import { UploadDialog } from "@/components/gallery/UploadDialog";

// Mock data - replace with API calls later
const mockImages: GalleryImage[] = [
  {
    id: "1",
    url: "/images/gallery/tournament-1.jpg",
    title: "Championship Match 2025",
    uploadedAt: "October 15, 2025",
  },
  {
    id: "2",
    url: "/images/gallery/team-photo.jpg",
    title: "Team Blue Dragons",
    uploadedAt: "October 10, 2025",
  },
  {
    id: "3",
    url: "/images/gallery/practice-1.jpg",
    title: "Morning Practice Session",
    uploadedAt: "October 5, 2025",
  },
  {
    id: "4",
    url: "/images/gallery/tournament-2.jpg",
    title: "Semi-finals Action Shot",
    uploadedAt: "October 1, 2025",
  },
  {
    id: "5",
    url: "/images/gallery/victory.jpg",
    title: "Victory Celebration",
    uploadedAt: "September 28, 2025",
  },
  {
    id: "6",
    url: "/images/gallery/team-huddle.jpg",
    title: "Team Huddle",
    uploadedAt: "September 25, 2025",
  },
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(mockImages);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleUpload = async (uploads: { file: File; title?: string }[]) => {
    // Mock upload - replace with actual API call
    const newImages: GalleryImage[] = uploads.map((upload, index) => ({
      id: `new-${Date.now()}-${index}`,
      url: URL.createObjectURL(upload.file),
      title: upload.title,
      uploadedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

    setImages(prev => [...newImages, ...prev]);
  };

  const handleDelete = (id: string) => {
    setImages(prev => prev.filter(image => image.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gallery</h1>
          <p className="text-neutral-600 mt-1">
            View, upload, and download photos from tournaments and events
          </p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
      </div>

      <GalleryGrid images={images} onDeleteImage={handleDelete} />

      <UploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onUpload={handleUpload}
      />
    </div>
  );
}
