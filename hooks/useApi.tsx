import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useApi = (fn: () => Promise<any>) => {
  const [data, setData] = useState(null);

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

  return { data };
};

export default useApi;
