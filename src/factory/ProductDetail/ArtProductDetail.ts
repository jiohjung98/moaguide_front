import { IArtProductDetail } from '@/types/ArtProductType';
import { useQuery, QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';

const fetchArtProductDetail = async (context: QueryFunctionContext) => {
  const product_id = context.queryKey[1] as string;
  const { data } = await axios.get(`https://api.moaguide.com/detail/art/${product_id}`);
  return data;
};

export const getArtProductDetail = (product_id: string) => {
  const queryKey = ['ArtProductDetail', product_id];

  const { data, ...queryProps } = useQuery<IArtProductDetail>({
    queryKey,
    queryFn: fetchArtProductDetail
  });

  return {
    data,
    ...queryProps
  };
};
