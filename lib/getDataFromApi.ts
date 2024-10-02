import { Alert } from 'react-native';
import * as Crypto from 'expo-crypto';

export const getAllUsers = async () => {
  const users = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`);
  return users.json();
};

export const getSingleUser = async (userId: string) => {
  const user = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`,
  );
  return user.json();
};

export const getUserByEmail = async (userEmail: string) => {
  const user = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/users/login/${userEmail}`,
  );
  return user.json();
};

export const getAllPosts = async () => {
  const posts = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/posts`);
  return posts.json();
};

export const getSinglePost = async (postId: string) => {
  const post = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/posts/${postId}`,
  );
  return post.json();
};

export const getAllPeaks = async () => {
  const peaks = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/peaks`);
  return peaks.json();
};

export const getSinglePeak = async (peakId: string) => {
  const peak = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/peaks/${peakId}`,
  );
  return peak.json();
};

export const logIn = async (email: string, password: string) => {
  const errorMessage = 'Login lub hasło niepoprawne';

  try {
    const user = await getUserByEmail(email);
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password + user[0].registrationDate.toString(),
    );

    if (user[0].password === hashedPassword) {
      return user[0];
    }
    throw new Error(errorMessage);
  } catch (error) {
    throw new Error(errorMessage);
  }
};

export const createUser = async (
  username: string,
  email: string,
  password: string,
  // eslint-disable-next-line consistent-return
) => {
  const registerUser = async () => {
    const newUser = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`, {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    return newUser.json();
  };

  try {
    const isEmailUsed = await getUserByEmail(email);
    if (isEmailUsed.length === 0) {
      return await registerUser();
    }

    throw new Error('Użytkownik o takim adresie email już istnieje');
  } catch (err) {
    Alert.alert('Błąd...', (err as Error).message);
  }
};
