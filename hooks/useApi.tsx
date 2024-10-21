import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { IPeakProps, IPostsProps, IRoleTypes, IUserProps } from '@/lib/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useApi = (fn: () => Promise<any>) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
    IPostsProps[] | IUserProps[] | IPeakProps[] | IRoleTypes[] | null
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

  const reFetch = () => fetchData();

  return { data, loading, reFetch };
};

export default useApi;
