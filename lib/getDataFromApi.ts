export const getAllUsers = async () => {
  const users = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/`);
  return users.json();
};

export const getSingleUser = async (userId: string) => {
  const user = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`,
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
