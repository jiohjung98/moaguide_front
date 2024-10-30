import { basicAxiosInstance } from '@/service/axiosInstance';
import { MainReportNewsType } from '@/types/homeComponentsType';
import { useQuery } from '@tanstack/react-query';

const fetchReportIssues = async () => {
  const { data } = await basicAxiosInstance.get(`/`);
  return data;
};

export const getReportIssues = () => {
  const queryKey = ['ReportIssues'];

  const { data, ...queryProps } = useQuery<MainReportNewsType>({
    queryKey,
    queryFn: fetchReportIssues
  });

  const mainReport = data?.mainReport || [];
  const mainNews = data?.mainNews || [];

  return {
    mainReport,
    mainNews,
    ...queryProps
  };
};
