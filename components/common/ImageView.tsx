"use client";

import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  isStock?: number;
}

const ImageView = ({ images = [], isStock }: Props) => {
  // ✅ safe fallback
  const [active, setActive] = useState(images?.[0] || null);

  // ❌ if no images
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center border rounded-md text-gray-400">
        No Image Available
      </div>
    );
  }

  const activeImage = active || images[0];

  return (
    <div className="w-full space-y-2 md:space-y-4">
      {/* Main Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeImage?._key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-h-[550px] min-h-[450px] border border-dark-color/10 rounded-md group overflow-hidden"
        >
          <Image
            src={urlFor(activeImage).url()}
            alt="productImage"
            width={700}
            height={700}
            priority
            className={`w-full h-96 max-h-[550px] min-h-[500px] object-contain group-hover:scale-110 hoverEffect rounded-md ${
              isStock === 0 ? "opacity-50" : ""
            }`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Thumbnails */}
      <div className="grid grid-cols-6 gap-2 h-20 md:h-24">
        {images.map((image) => (
          <button
            key={image._key}
            onClick={() => setActive(image)}
            className={`border rounded-md overflow-hidden transition-all ${
              activeImage?._key === image._key
                ? "ring-1 ring-dark-color"
                : ""
            }`}
          >
            <Image
              src={urlFor(image).url()}
              alt={`Thumbnail ${image._key}`}
              width={100}
              height={100}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageView;