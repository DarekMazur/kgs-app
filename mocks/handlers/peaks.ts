// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';
import { db } from '@/mocks/db';

export const handlers = [
  http.get('http://localhost/api/peaks', () => {
    return HttpResponse.json(db.peak.getAll());
  }),

  http.get('http://localhost/api/peaks/:peakId', async ({ params }) => {
    const { peakId } = params;
    return HttpResponse.json(
      db.peak.getAll().filter((post) => post.id === peakId),
    );
  }),
];
