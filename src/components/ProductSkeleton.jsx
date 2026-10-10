export default function ProductSkeleton() {
  return (
    <div className="mx-auto mb-10 flex max-w-6xl flex-col gap-8 px-4 pt-60 sm:pt-56 lg:pt-55 md:flex-row">

      {/* Image Skeleton */}
      <div className="flex w-full h-72 sm:h-112 items-center justify-center bg-gray-200 p-3 sm:p-6 md:w-1/2 rounded-lg">
        <div className="h-full w-full max-w-100 max-h-100 bg-gray-300 rounded-md"></div>
      </div>

      {/* Details Skeleton */}
      <div className="flex w-full flex-col gap-4 md:w-1/2 justify-center">
        {/* Category */}
        <div className="h-4 w-1/4 bg-gray-300 rounded"></div>

        {/* Title */}
        <div className="h-9 w-3/4 bg-gray-300 rounded"></div>

        {/* Description Lines */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
        </div>

        {/* Price */}
        <div className="h-9 w-1/4 bg-gray-300 rounded mt-2"></div>

        {/* Discount */}
        <div className="h-5 w-1/3 bg-gray-300 rounded"></div>

        {/* Rating & Stock */}
        <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
        <div className="h-5 w-1/4 bg-gray-300 rounded"></div>

        {/* Button Placeholder */}
        <div className="mt-2 h-12 w-full sm:w-36 bg-gray-300 rounded-xl"></div>
      </div>

    </div>
  );
}
