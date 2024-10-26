import React from 'react';

const CategoryPracticeItemSkeleton = () => {
  return (
    <div className="pb-5 w-full h-[100px] animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-full bg-gray-200 rounded-[8px]"></div>
    </div>
  );
};

export default CategoryPracticeItemSkeleton;