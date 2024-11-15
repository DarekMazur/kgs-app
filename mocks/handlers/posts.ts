// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';
import JWT from 'expo-jwt';
import uuid from 'react-native-uuid';
import { db } from '@/mocks/db';
import { IPublicPeak, IPublicPost } from '@/lib/types';
import { constants } from '@/constants';

export const handlers = [
  http.get(`${process.env.EXPO_PUBLIC_API_URL}/posts`, ({ request }) => {
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

      return HttpResponse.json(db.post.getAll());
    } catch (error) {
      return HttpResponse.json('Authentication failed', { status: 403 });
    }
  }),

  http.get(
    `${process.env.EXPO_PUBLIC_API_URL}/posts/:postId`,
    ({ request, params }) => {
      const { postId } = params;
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

        return HttpResponse.json(
          db.post.findFirst({
            where: {
              id: {
                equals: postId as string,
              },
            },
          }),
        );
      } catch (error) {
        return HttpResponse.json('Authentication failed', { status: 403 });
      }
    },
  ),

  http.post(`${process.env.EXPO_PUBLIC_API_URL}/posts`, async ({ request }) => {
    interface IInput {
      notes: string;
      photo: string;
      peakId: string;
      authorId: string;
    }

    // @ts-expect-error
    const token = request.headers.map.authorization?.split(' ')[1];
    const { notes, photo, peakId, authorId } = (await request.json()) as IInput;

    if (!token) {
      return HttpResponse.json('Invalid or expired token', { status: 403 });
    }

    try {
      const decode = JWT.decode(
        token,
        process.env.EXPO_PUBLIC_SECRET_KEY as string,
      );

      if (!notes || !photo || !peakId || !authorId) {
        return HttpResponse.json('Request failed', { status: 400 });
      }

      if (!decode || decode.id !== authorId) {
        return HttpResponse.json('Authentication failed', { status: 403 });
      }

      const peak = db.peak.findFirst({
        where: {
          id: {
            equals: peakId,
          },
        },
      });

      const author = db.user.findFirst({
        where: {
          id: {
            equals: authorId,
          },
        },
      });

      if (author && peak) {
        const newPost: IPublicPost = {
          id: uuid.v4() as string,
          notes,
          photo,
          peak,
          isHidden: false,
          createdAt: new Date(Date.now()),
          author: {
            id: authorId,
            username: author.username,
            firstName: author.firstName,
            avatar: author.avatar,
            isSuspended:
              !!author.suspensionTimeout &&
              author.suspensionTimeout > new Date(Date.now()),
            isBanned: author.isBanned,
            role: author.role?.id as number,
          },
        };

        return HttpResponse.json(newPost, { status: 200 });
      }

      if (!author) {
        return HttpResponse.json('Author not found', { status: 404 });
      }

      if (!peak) {
        return HttpResponse.json('Peak not found', { status: 403 });
      }
    } catch (error) {
      return HttpResponse.json('Authentication failed', { status: 403 });
    }
  }),

  http.put(
    `${process.env.EXPO_PUBLIC_API_URL}/posts/:postId`,
    async ({ request, params }) => {
      interface IInput {
        notes: string;
        photo: string;
        isHidden: boolean;
      }

      // @ts-expect-error
      const token = request.headers.map.authorization?.split(' ')[1];
      const { postId } = params;
      const { notes, isHidden } = (await request.json()) as IInput;

      if (!token) {
        return HttpResponse.json('Invalid or expired token', { status: 403 });
      }

      try {
        const decode = JWT.decode(
          token,
          process.env.EXPO_PUBLIC_SECRET_KEY as string,
        );

        if (!notes && !isHidden) {
          return HttpResponse.json('Request failed', { status: 400 });
        }

        const post = db.post.findFirst({
          where: {
            id: {
              equals: postId as string,
            },
          },
        });

        if (post) {
          if (!decode || decode.id !== post.author.id || decode.role === 3) {
            return HttpResponse.json('Authentication failed', { status: 403 });
          }

          const updatedPost: IPublicPost = {
            id: post.id,
            notes: notes ?? post.notes,
            photo: post.photo,
            peak: post.peak as IPublicPeak,
            isHidden: isHidden !== undefined ? isHidden : post.isHidden,
            createdAt: post.createdAt,
            author: {
              id: post.author.id as string,
              username: post.author.username as string,
              firstName: post.author.firstName,
              avatar: post.author.avatar,
              isSuspended: !!post.author.isSuspended,
              isBanned: !!post.author.isBanned,
              role: post.author.role as number,
            },
          };

          db.post.update({
            where: {
              id: {
                equals: postId as string,
              },
            },
            data: {
              notes: updatedPost.notes,
              isHidden: updatedPost.isHidden,
            },
          });

          return HttpResponse.json(updatedPost, { status: 200 });
        }

        return HttpResponse.json('Post not found', { status: 404 });
      } catch (error) {
        return HttpResponse.json('Authentication failed', { status: 403 });
      }
    },
  ),

  //   http.get(`${process.env.EXPO_PUBLIC_API_URL}/posts`, () => {
  //     return HttpResponse.json(
  //       db.post.getAll().sort((a, b) => {
  //         if (b.createdAt > a.createdAt) {
  //           return 1;
  //         }
  //
  //         if (a.createdAt > b.createdAt) {
  //           return -1;
  //         }
  //
  //         return 0;
  //       }),
  //     );
  //   }),
  //
  //   http.get(
  //     `${process.env.EXPO_PUBLIC_API_URL}/posts/:postId`,
  //     async ({ params }) => {
  //       const { postId } = params;
  //       return HttpResponse.json(
  //         db.post.getAll().filter((post) => post.id === postId),
  //       );
  //     },
  //   ),
  //
  //   http.post(`${process.env.EXPO_PUBLIC_API_URL}/posts`, async ({ request }) => {
  //     const newPost = (await request.json()) as IPublicPost;
  //     const createdTime = new Date(Date.now());
  //
  //     const user = db.user.findFirst({
  //       where: {
  //         id: {
  //           equals: newPost.author.id as string,
  //         },
  //       },
  //     })!;
  //
  //     const newPostData = {
  //       id: newPost.id,
  //       createdAt: createdTime,
  //       author: {
  //         id: user.id,
  //         username: user.username,
  //         firstName: user.firstName,
  //         avatar: user.avatar,
  //         isSuspended: constants.suspensionConditions(user.suspensionTimeout),
  //         isBanned: user.isBanned,
  //       },
  //       notes: newPost.notes,
  //       photo: newPost.photo,
  //       isHidden: false,
  //       peak: db.peak.findFirst({
  //         where: {
  //           id: {
  //             equals: newPost.peak?.id as string,
  //           },
  //         },
  //       })!,
  //     };
  //
  //     db.post.create(newPostData);
  //     db.user.update({
  //       where: {
  //         id: {
  //           equals: user.id,
  //         },
  //       },
  //       data: {
  //         posts: [...user.posts, newPostData],
  //       },
  //     });
  //
  //     return HttpResponse.json(newPostData, { status: 201 });
  //   }),
  //
  //   http.put(
  //     `${process.env.EXPO_PUBLIC_API_URL}/posts/:postId`,
  //     // eslint-disable-next-line consistent-return
  //     async ({ request }) => {
  //       const updatedPost = (await request.json()) as IPublicPost;
  //
  //       if (updatedPost) {
  //         db.post.update({
  //           where: {
  //             id: {
  //               equals: updatedPost.id,
  //             },
  //           },
  //           data: {
  //             notes: updatedPost.notes,
  //             isHidden: updatedPost.isHidden,
  //           },
  //         });
  //
  //         return HttpResponse.json(updatedPost, { status: 201 });
  //       }
  //     },
  //   ),
  //
  //   http.delete(
  //     `${process.env.EXPO_PUBLIC_API_URL}/posts/:postId`,
  //     async ({ params }) => {
  //       const { postId } = params;
  //
  //       if (postId) {
  //         const post = db.post.findFirst({
  //           where: {
  //             id: {
  //               equals: postId as string,
  //             },
  //           },
  //         })!;
  //
  //         const user = db.user.findFirst({
  //           where: {
  //             id: {
  //               equals: post.author.id as string,
  //             },
  //           },
  //         })!;
  //
  //         db.post.delete({
  //           where: {
  //             id: {
  //               equals: postId as string,
  //             },
  //           },
  //         });
  //
  //         db.user.update({
  //           where: {
  //             id: {
  //               equals: user.id as string,
  //             },
  //           },
  //           data: {
  //             posts: user.posts.filter((userPost) => userPost.id !== postId),
  //           },
  //         });
  //         return HttpResponse.json();
  //       }
  //
  //       return new HttpResponse(null, { status: 404 });
  //     },
  //   ),
];
