// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';
import { db } from '../db';

export const handlers = [
  http.get('/api/posts', () => {
    return HttpResponse.json(db.post.getAll());
  }),

  http.get('/api/users', () => {
    return HttpResponse.json(db.user.getAll());
  }),

  http.get('/api/peaks', () => {
    return HttpResponse.json(db.peak.getAll());
  }),

  http.get('/api/roles', () => {
    return HttpResponse.json(db.role.getAll());
  }),
];
