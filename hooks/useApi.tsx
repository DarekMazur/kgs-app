import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useApi = (fn: () => Promise<any>) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return { data, loading };
};

export default useApi;
