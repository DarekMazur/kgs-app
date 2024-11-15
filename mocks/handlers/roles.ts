// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';
import JWT from 'expo-jwt';
import { db } from '@/mocks/db';

export const handlers = [
  http.get(`${process.env.EXPO_PUBLIC_API_URL}/roles`, ({ request }) => {
    // @ts-expect-error
    const token = request.headers.map.authorization?.split(' ')[1];

    if (!token) {
      return HttpResponse.json('Invalid or expired token', { status: 403 });
    }

    try {
      const decode = JWT.decode(
        token,
        process.env.EXPO_PUBLIC_SECRET_KEY as string,
      );

      if (!decode) {
        return HttpResponse.json('Authentication failed', { status: 403 });
      }

      return HttpResponse.json(db.role.getAll(), { status: 200 });
    } catch (error) {
      return HttpResponse.json('Authentication failed', { status: 403 });
    }
  }),
];
