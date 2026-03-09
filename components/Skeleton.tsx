import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-black/10 dark:bg-white/10',
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-[32px] p-4 border bg-white dark:bg-[#13141B] border-black/5 dark:border-white/5">
      <Skeleton className="aspect-square rounded-3xl mb-6" />
      <div className="flex justify-between items-start px-2 pb-2">
        <div className="flex-1">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="h-screen flex items-center justify-center bg-brand-black">
      <div className="text-center px-6 max-w-6xl mx-auto">
        <Skeleton className="h-12 w-64 mx-auto mb-10 rounded-full" />
        <Skeleton className="h-20 w-2/3 mx-auto mb-6" />
        <Skeleton className="h-6 w-96 mx-auto mb-8" />
        <div className="flex justify-center gap-6">
          <Skeleton className="h-14 w-48 rounded-full" />
          <Skeleton className="h-14 w-48 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DetailsPageSkeleton() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-6">
          <Skeleton className="aspect-square rounded-[40px]" />
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-8 w-1/4 mb-8" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-2/3 mb-12" />
          <Skeleton className="h-16 w-full mb-6" />
          <Skeleton className="h-16 w-full mb-12" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="rounded-[32px] overflow-hidden border border-black/5 dark:border-white/5">
      <Skeleton className="aspect-video" />
      <div className="p-8">
        <Skeleton className="h-4 w-1/4 mb-4" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-2/3 mb-6" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
