export default function NavbarSkeleton() {
  return (
    <div className="flex items-center space-x-2 lg:space-x-6">
      {/* Premium/All Courses Button Skeleton */}
      <div className="flex items-center gap-1.5 bg-[#6B7280]/20 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg animate-pulse">
        <div className="h-3 w-3 lg:h-4 lg:w-4 bg-[#6B7280]/40 rounded"></div>
        <div className="hidden sm:block h-3 w-16 bg-[#6B7280]/40 rounded"></div>
      </div>

      {/* Shopping Cart Skeleton */}
      <div className="relative p-2">
        <div className="h-5 w-5 bg-[#6B7280]/40 rounded animate-pulse"></div>
      </div>

      {/* User Avatar Skeleton */}
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#6B7280]/40 rounded-full animate-pulse"></div>
        <div className="hidden lg:block">
          <div className="h-3 w-20 bg-[#6B7280]/40 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Logout Button Skeleton */}
      <div className="h-8 bg-[#6B7280]/40 rounded-lg w-16 animate-pulse"></div>
    </div>
  );
}

export function MobileNavbarSkeleton() {
  return (
    <div className="px-2 py-2 border-t border-[#6B7280]">
      <div className="flex items-center justify-between">
        {/* User Info Skeleton */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-[#6B7280]/40 rounded-full animate-pulse"></div>
          <div className="h-4 w-24 bg-[#6B7280]/40 rounded animate-pulse"></div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex space-x-2">
          <div className="h-8 w-20 bg-[#6B7280]/40 rounded animate-pulse"></div>
          <div className="h-8 w-16 bg-[#6B7280]/40 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
