import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { IPeakProps, IPostsProps, IUserProps } from '@/lib/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useApi = (fn: () => Promise<any>) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
    IPostsProps[] | IUserProps[] | IPeakProps[] | null
  >(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fn();
      setData(res);
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useApi;
