// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';
import uuid from 'react-native-uuid';
import * as Crypto from 'expo-crypto';
import { db } from '@/mocks/db';
import { IRegisterProps, IUserProps } from '@/lib/types';

export const handlers = [
  http.get(`${process.env.EXPO_PUBLIC_API_URL}/users`, () => {
    return HttpResponse.json(db.user.getAll());
  }),

  http.get(`${process.env.EXPO_PUBLIC_API_URL}/current`, ({ request }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const token = request.headers.map.authorization;

    if (token) {
      try {
        if (token.split(' ')[1] === process.env.EXPO_PUBLIC_JWT) {
          const current = db.user.findFirst({
            where: {
              email: {
                equals: 'ta@mail.com',
              },
            },
          });

          return HttpResponse.json(current);
        }
        return HttpResponse.json('Error', { status: 404 });
      } catch (err) {
        return HttpResponse.json((err as Error).message, { status: 403 });
      }
    }

    return HttpResponse.json('', { status: 403 });
  }),

  http.get(
    `${process.env.EXPO_PUBLIC_API_URL}/users/:userId`,
    async ({ params }) => {
      const { userId } = params;
      return HttpResponse.json(
        db.user.getAll().filter((user) => user.id === userId),
      );
    },
  ),

  http.get(
    `${process.env.EXPO_PUBLIC_API_URL}/users/login/:userEmail`,
    async ({ params }) => {
      const { userEmail } = params;
      return HttpResponse.json(
        db.user
          .getAll()
          .filter((user) => user.email.toLowerCase() === userEmail),
      );
    },
  ),

  http.post(
    `${process.env.EXPO_PUBLIC_API_URL}/users/activate-send/`,
    async ({ request }) => {
      return HttpResponse.json(request, { status: 201 });
    },
  ),

  http.post(`${process.env.EXPO_PUBLIC_API_URL}/users`, async ({ request }) => {
    const newUser = (await request.json()) as IRegisterProps;
    const createdTime = Date.now();

    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      newUser.password + createdTime.toString(),
    );

    const newUserData = {
      id: uuid.v4() as string,
      username: newUser.username as string,
      email: newUser.email as string,
      password: hashedPassword,
      registrationDate: createdTime,
      firstName: '',
      lastName: '',
      avatar: '',
      description: '',
      posts: [],
      isBanned: false,
      suspensionTimeout: undefined,
      totalSuspensions: 0,
      isConfirmed: false,
      role: db.role.findFirst({
        where: {
          type: {
            equals: 'user',
          },
        },
      })!,
    };

    db.user.create({ ...newUserData });

    return HttpResponse.json(newUserData, { status: 201 });
  }),

  http.put(
    `${process.env.EXPO_PUBLIC_API_URL}/users/activate/:token`,
    async ({ params }) => {
      const isTokenExpired = (token: string) => {
        const arrayToken = token.split('.');
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        return Math.floor(new Date().getTime() / 1000) >= tokenPayload?.sub;
      };

      const { token } = params;

      if (token) {
        const arrayToken = (token as string).split('.');

        const tokenPayload = JSON.parse(atob(arrayToken[1]));

        if (isTokenExpired(token as string)) {
          return new HttpResponse(null, { status: 401 });
        }

        const user = db.user.findFirst({
          where: {
            id: {
              equals: tokenPayload.id as string,
            },
          },
        });

        if (user) {
          db.user.update({
            where: {
              id: {
                equals: user.id as string,
              },
            },
            data: {
              username: user.username as string,
              password: user.password,
              firstName: user.firstName,
              lastName: user.lastName,
              avatar: user.avatar,
              description: user.description,
              isBanned: user.isBanned,
              totalSuspensions: user.totalSuspensions,
              suspensionTimeout: user.suspensionTimeout,
              isConfirmed: true,
              role: db.role.findFirst({
                where: {
                  id: {
                    equals: user.role?.id,
                  },
                },
              })!,
            },
          });

          return HttpResponse.json(user, { status: 200 });
        }
        return new HttpResponse(null, { status: 401 });
      }

      return new HttpResponse(null, { status: 404 });
    },
  ),

  http.put(
    `${process.env.EXPO_PUBLIC_API_URL}/users/:userId`,
    // eslint-disable-next-line consistent-return
    async ({ request }) => {
      const updatedUser = (await request.json()) as IUserProps;
      const user = db.user.findFirst({
        where: {
          id: {
            equals: updatedUser.id as string,
          },
        },
      })!;

      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        updatedUser.password + user.registrationDate.toString(),
      );

      const oldData = db.user.findFirst({
        where: {
          id: {
            equals: updatedUser.id as string,
          },
        },
      })!;

      if (updatedUser) {
        db.user.update({
          where: {
            id: {
              equals: updatedUser.id as string,
            },
          },
          data: {
            username: (updatedUser.username as string) ?? oldData.username,
            password: updatedUser.password ? hashedPassword : oldData.password,
            firstName: updatedUser.firstName ?? oldData.firstName,
            lastName: updatedUser.lastName ?? oldData.lastName,
            avatar:
              updatedUser.avatar === null
                ? undefined
                : (updatedAvatar ?? oldData.avatar),
            description: updatedUser.description ?? oldData.description,
            isBanned: updatedUser.isBanned ?? oldData.isBanned,
            totalSuspensions:
              updatedUser.totalSuspensions ?? oldData.totalSuspensions,
            suspensionTimeout:
              updatedUser.suspensionTimeout ?? oldData.suspensionTimeout,
            isConfirmed: updatedUser.isConfirmed ?? oldData.isConfirmed,
            role: db.role.findFirst({
              where: {
                id: {
                  equals: updatedUser.role?.id ?? oldData.role?.id,
                },
              },
            })!,
          },
        });

        db.post.update({
          where: {
            author: {
              id: {
                equals: updatedUser.id as string,
              },
            },
          },
          data: {
            author: {
              isBanned: updatedUser.isBanned,
            },
          },
        });

        return HttpResponse.json(updatedUser, { status: 201 });
      }
    },
  ),

  http.delete(
    `${process.env.EXPO_PUBLIC_API_URL}/users/:userId`,
    async ({ params }) => {
      const { userId } = params;

      if (userId) {
        db.user.delete({
          where: {
            id: {
              equals: userId as string,
            },
          },
        });
        return HttpResponse.json();
      }

      return new HttpResponse(null, { status: 404 });
    },
  ),
];
