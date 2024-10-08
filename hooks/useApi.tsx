import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { IPeakProps, IPostsProps, IUserRequireProps } from '@/lib/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useApi = (fn: () => Promise<any>) => {
  const [data, setData] = useState<
    IPostsProps[] | IUserRequireProps[] | IPeakProps[]
  >(null);

  const fetchData = async () => {
    try {
      const res = await fn();
      setData(res);
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, refetch };
};

export default useApi;
