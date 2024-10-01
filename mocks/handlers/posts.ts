// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';
import uuid from 'react-native-uuid';
import { db } from '@/mocks/db';
import { IPostsProps } from '@/lib/types';

export const handlers = [
  http.get('http://localhost/api/posts', () => {
    return HttpResponse.json(db.post.getAll());
  }),

  http.get('http://localhost/api/posts/:postId', async ({ params }) => {
    const { postId } = params;
    return HttpResponse.json(
      db.post.getAll().filter((post) => post.id === postId),
    );
  }),

  http.post('http://localhost/api/posts', async ({ request }) => {
    const newPost = (await request.json()) as IPostsProps;
    const createdTime = new Date(Date.now());

    db.post.create({
      id: uuid.v4() as string,
      createdAt: createdTime,
      author: db.user.findFirst({
        where: {
          id: {
            equals: newPost.author.id as string,
          },
        },
      })!,
      notes: newPost.notes,
      photo: newPost.photo,
      peak: db.peak.findFirst({
        where: {
          id: {
            equals: newPost.peak.id as string,
          },
        },
      })!,
    });

    return HttpResponse.json(newPost, { status: 201 });
  }),

  // eslint-disable-next-line consistent-return
  http.put('http://localhost/api/posts/:postId', async ({ request }) => {
    const updatedPost = (await request.json()) as IPostsProps;

    if (updatedPost) {
      db.post.update({
        where: {
          id: {
            equals: updatedPost.id,
          },
        },
        data: {
          notes: updatedPost.notes,
          photo: updatedPost.photo,
        },
      });

      return HttpResponse.json(updatedPost, { status: 201 });
    }
  }),

  http.delete('http://localhost/api/posts/:postId', async ({ params }) => {
    const { postId } = params;

    if (postId) {
      db.post.delete({
        where: {
          id: {
            equals: postId as string,
          },
        },
      });
      return HttpResponse.json();
    }

    return new HttpResponse(null, { status: 404 });
  }),
];
