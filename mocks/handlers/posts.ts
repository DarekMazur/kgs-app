// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';
import { db } from '@/mocks/db';
import { IPostsProps } from '@/lib/types';

export const handlers = [
  http.get(`${process.env.EXPO_PUBLIC_API_URL}/posts`, () => {
    return HttpResponse.json(
      db.post
        .getAll()
        .sort(
          (a, b) =>
            b.createdAt.getMilliseconds() - a.createdAt.getMilliseconds(),
        ),
    );
  }),

  http.get(
    `${process.env.EXPO_PUBLIC_API_URL}/posts/:postId`,
    async ({ params }) => {
      const { postId } = params;
      return HttpResponse.json(
        db.post.getAll().filter((post) => post.id === postId),
      );
    },
  ),

  http.post(`${process.env.EXPO_PUBLIC_API_URL}/posts`, async ({ request }) => {
    const newPost = (await request.json()) as IPostsProps;
    const createdTime = new Date(Date.now());

    const user = db.user.findFirst({
      where: {
        id: {
          equals: newPost.author.id as string,
        },
      },
    })!;

    const newPostData = {
      id: newPost.id,
      createdAt: createdTime,
      author: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        avatar: user.avatar,
      },
      notes: newPost.notes,
      photo: newPost.photo,
      peak: db.peak.findFirst({
        where: {
          id: {
            equals: newPost.peak?.id as string,
          },
        },
      })!,
    };

    db.post.create(newPostData);
    db.user.update({
      where: {
        id: {
          equals: user.id,
        },
      },
      data: {
        posts: [...user.posts, newPostData],
      },
    });

    return HttpResponse.json(newPostData, { status: 201 });
  }),

  http.put(
    `${process.env.EXPO_PUBLIC_API_URL}/posts/:postId`,
    // eslint-disable-next-line consistent-return
    async ({ request }) => {
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
          },
        });

        return HttpResponse.json(updatedPost, { status: 201 });
      }
    },
  ),

  http.delete(
    `${process.env.EXPO_PUBLIC_API_URL}/posts/:postId`,
    async ({ params }) => {
      const { postId } = params;

      if (postId) {
        const post = db.post.findFirst({
          where: {
            id: {
              equals: postId as string,
            },
          },
        })!;

        const user = db.user.findFirst({
          where: {
            id: {
              equals: post.author.id as string,
            },
          },
        })!;

        db.post.delete({
          where: {
            id: {
              equals: postId as string,
            },
          },
        });

        db.user.update({
          where: {
            id: {
              equals: user.id as string,
            },
          },
          data: {
            posts: user.posts.filter((userPost) => userPost.id !== postId),
          },
        });
        return HttpResponse.json();
      }

      return new HttpResponse(null, { status: 404 });
    },
  ),
];
