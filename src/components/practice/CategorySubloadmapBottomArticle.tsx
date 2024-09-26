import React from 'react';
import { SubLoadmapBottomArticleItemsProps } from '@/types/homeComponentsType';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CategorySubloadmapBottomArticle: React.FC<SubLoadmapBottomArticleItemsProps> = ({ data }) => {
  const router = useRouter();

  const handleClick = () => {
    console.log(data.id);
    router.push(`/practice/${data.id}`);
  };

  return (
    <div className='py-5' onClick={handleClick}>
      <div className="flex gap-5 items-center cursor-pointer">
        <Image
          src={data.imageLink}
          alt={data.title}
          width={70}
          height={70}
          className="w-[70px] h-[70px]"
        />
        <div className="flex-1 flex flex-col gap-3">
          <div className="text-gray600 text-body5 sm:text-title1">{data.title}</div>
          <div className="text-gray300 text-caption3 sm:text-body7">{data.description}</div>
        </div>
      </div>
    </div>
  );
};

export default CategorySubloadmapBottomArticle;