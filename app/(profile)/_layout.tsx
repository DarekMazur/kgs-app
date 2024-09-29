import { Stack } from 'expo-router';

const ProfileLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='profile-edit'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
