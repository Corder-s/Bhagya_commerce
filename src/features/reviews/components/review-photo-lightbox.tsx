"use client";

import { X } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Modal, ModalContent } from "@/components/ui/modal";

export function ReviewPhotoLightbox({
  isOpen,
  onClose,
  photoUrl,
  authorName,
}: {
  isOpen: boolean;
  onClose: () => void;
  photoUrl: string | null;
  authorName?: string;
}) {
  if (!photoUrl) return null;

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent
        title={`Customer Review Photo${authorName ? ` by ${authorName}` : ""}`}
        description="Verified customer snapshot of handcrafted item in natural lighting"
        size="lg"
      >
        <div className="space-y-4 pt-1">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/5 border border-line">
            <Image
              src={photoUrl}
              alt="Customer product review photo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close Preview
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
