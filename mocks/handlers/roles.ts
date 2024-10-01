// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';
import { db } from '@/mocks/db';

export const handlers = [
  http.get(`${process.env.EXPO_PUBLIC_API_URL}/roles`, () => {
    return HttpResponse.json(db.role.getAll());
  }),
];
