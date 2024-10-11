import { Stack } from 'expo-router';

const termsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='kgs'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='app-terms'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default termsLayout;
