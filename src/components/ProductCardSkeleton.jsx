// ProductCardSkeleton.jsx
import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="w-full animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col">

      {/* Image Block Placeholder */}
      {/* w-full handles mobile screens, md:w-75 restores your desktop layout */}
      <div className="relative w-50 md:w-75 aspect-square bg-gray-200 flex items-center justify-center">
        {/* Sale Tag Placeholder */}
        <div className="absolute top-3 left-3 bg-gray-300 h-5 w-12 rounded-sm" />
      </div>


      {/* Content Block Placeholders */}
      <div className="p-3 sm:px-5 py-3 flex flex-col flex-1">

        {/* Category Placeholder */}
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-2.5" />

        {/* Title Placeholder (2-lines height matching line-clamp-2) */}
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-4/5" />
        </div>

        {/* Star Rating Layout Placeholder */}
        <div className="flex items-center mt-2.5 mb-5">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 bg-gray-200 rounded-full" />
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-8 ml-3" />
        </div>

        {/* Footer: Pricing and Button Layout */}
        <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          {/* Price Placeholder (Regular and Line-through) */}
          <div className="flex flex-col space-y-1.5 min-w-0">
            <div className="h-6 bg-gray-200 rounded w-16 sm:h-7" />
            <div className="h-4 bg-gray-200 rounded w-12" />
          </div>

          {/* Button Placeholder */}
          <div className="h-9 bg-gray-200 rounded-xl w-full sm:w-28 sm:shrink-0" />
        </div>

      </div>
    </div>
  );
}
