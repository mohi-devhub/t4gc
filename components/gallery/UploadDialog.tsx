"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (images: { file: File; title: string }[]) => void;
}

export function UploadDialog({ open, onOpenChange, onUpload }: UploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; preview: string; title: string }[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      title: '', // Initialize with empty title
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 5242880, // 5MB
  });

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    // Check if all images have titles
    const missingTitles = selectedFiles.some(file => !file.title.trim());
    if (missingTitles) {
      toast.error("Please provide titles for all images");
      return;
    }

    onUpload(selectedFiles.map(({ file, title }) => ({ file, title })));
    setSelectedFiles([]);
    onOpenChange(false);
    toast.success("Images uploaded successfully");
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateTitle = (index: number, title: string) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = { ...newFiles[index], title };
      return newFiles;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? "border-blue-500 bg-blue-50" : "border-neutral-200 hover:border-neutral-300"}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-8 w-8 text-neutral-400" />
            <p className="mt-2 text-sm text-neutral-600">
              {isDragActive
                ? "Drop your images here..."
                : "Drag & drop images here, or click to select"}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Supports: JPG, PNG, GIF (max 5MB each)
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              {selectedFiles.map((file, index) => (
                <div key={file.preview} className="flex items-start gap-4 p-3 bg-neutral-50 rounded-lg">
                  <div className="relative h-20 w-20 shrink-0">
                    <Image
                      src={file.preview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${index}`} className="flex items-center gap-1">
                        Image Title
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`title-${index}`}
                        value={file.title}
                        onChange={e => updateTitle(index, e.target.value)}
                        placeholder="Enter a title for this image"
                        required
                        className={!file.title.trim() ? "border-red-200 focus-visible:ring-red-200" : ""}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}