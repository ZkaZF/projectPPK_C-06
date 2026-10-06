export default function FacilityCardSkeleton() {
  return (
    <article className="bg-white rounded-lg border border-institution-200 overflow-hidden flex flex-col group animate-pulse">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full bg-institution-100 overflow-hidden border-b border-institution-100 flex items-center justify-center" />

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <div className="h-5 bg-institution-200 rounded w-3/4 mb-3"></div>
          
          {/* Specs */}
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-institution-100 rounded w-1/2"></div>
            <div className="h-3 bg-institution-100 rounded w-1/3"></div>
          </div>
          
          {/* Description line */}
          <div className="h-3 bg-institution-50 rounded w-full mb-1"></div>
          <div className="h-3 bg-institution-50 rounded w-4/5 mb-4"></div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="pt-3 border-t border-institution-100 flex items-center justify-between gap-2 mt-auto">
          <div className="h-4 bg-institution-100 rounded w-20"></div>
          <div className="h-8 bg-institution-200 rounded w-32"></div>
        </div>
      </div>
    </article>
  );
}
