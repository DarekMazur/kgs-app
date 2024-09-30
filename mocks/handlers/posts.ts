// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { db } from '@/mocks/db';

export const handlers = [
  http.get('/api/posts', () => {
    return HttpResponse.json(db.post.getAll());
  }),

  http.get('/api/posts/:postId', async ({ params }) => {
    const { postId } = params;
    return HttpResponse.json(
      db.post.getAll().filter((post) => post.id === postId),
    );
  }),

  http.post('/api/posts', async ({ request }) => {
    const newPost = await request.json();
    const createdTime = new Date(Date.now());

    db.post.create({
      id: faker.string.uuid(),
      createdAt: createdTime,
      ...newPost,
    });

    return HttpResponse.json(newPost, { status: 201 });
  }),

  // eslint-disable-next-line consistent-return
  http.put('/api/posts/:postId', async ({ request }) => {
    const updatedPost = await request.json();

    if (updatedPost) {
      db.post.update({
        where: {
          id: {
            equals: updatedPost.id,
          },
        },
        data: {
          ...updatedPost,
        },
      });

      return HttpResponse.json(updatedPost, { status: 201 });
    }
  }),

  http.delete('/api/posts/:postId', async ({ request }) => {
    const postId = await request.json();

    if (postId) {
      db.post.delete({
        where: {
          id: {
            equals: postId.id,
          },
        },
      });
      return HttpResponse.json();
    }

    return new HttpResponse(null, { status: 404 });
  }),
];
