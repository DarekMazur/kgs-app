// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';
import { db } from '@/mocks/db';

export const handlers = [
  http.get('/api/peaks', () => {
    return HttpResponse.json(db.peak.getAll());
  }),
];
