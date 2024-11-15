// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';
import uuid from 'react-native-uuid';
import * as Crypto from 'expo-crypto';
import JWT from 'expo-jwt';
import { db } from '@/mocks/db';
import { IRegister, IPublicUser, IMessage } from '@/lib/types';
import { constants } from '@/constants';

export const handlers = [
  http.get(`${process.env.EXPO_PUBLIC_API_URL}/users`, ({ request }) => {
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

      return HttpResponse.json(db.user.getAll());
    } catch (error) {
      return HttpResponse.json('Authentication failed', { status: 403 });
    }
  }),

  http.get(`${process.env.EXPO_PUBLIC_API_URL}/users/login`, ({ request }) => {
    // @ts-expect-error
    if (request.body && request.body.email) {
      const loggedUser = db.user.findFirst({
        where: {
          email: {
            // @ts-expect-error
            equals: request.body.email,
          },
        },
      });

      if (!loggedUser) {
        return HttpResponse.json('User not found', { status: 404 });
      }

      // @ts-expect-error
      if (loggedUser.password !== request.body.password) {
        return HttpResponse.json('Authentication failed', { status: 403 });
      }

      const token = JWT.encode(
        {
          iat: Date.now(),
          exp: Date.now() + constants.fullDayMilliseconds * 30,
          id: loggedUser.id,
          role: loggedUser.role?.id,
        },
        process.env.EXPO_PUBLIC_SECRET_KEY as string,
      );

      const response = {
        data: loggedUser,
        token,
      };

      return HttpResponse.json(response, { status: 200 });
    }
    return HttpResponse.json('Request failed', { status: 400 });
  }),

  http.get(
    `${process.env.EXPO_PUBLIC_API_URL}/users/current`,
    ({ request }) => {
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

        const { id } = decode;

        const currentUser = db.user.findFirst({
          where: {
            id: {
              equals: id,
            },
          },
        });

        return HttpResponse.json(currentUser);
      } catch (error) {
        return HttpResponse.json('Authentication failed', { status: 403 });
      }
    },
  ),

  http.get(
    `${process.env.EXPO_PUBLIC_API_URL}/users/:userId`,
    async ({ request, params }) => {
      // @ts-expect-error
      const token = request.headers.map.authorization?.split(' ')[1];
      const { userId } = params;

      if (!token) {
        return HttpResponse.json('Invalid or expired token', { status: 403 });
      }

      if (!userId) {
        return HttpResponse.json('Request failed', { status: 400 });
      }

      try {
        const decode = JWT.decode(
          token,
          process.env.EXPO_PUBLIC_SECRET_KEY as string,
        );

        if (!decode) {
          return HttpResponse.json('Authentication failed', { status: 403 });
        }

        const user = db.user.findFirst({
          where: {
            id: {
              equals: userId as string,
            },
          },
        });

        return HttpResponse.json(user, { status: 200 });
      } catch (error) {
        return HttpResponse.json('Authentication failed', { status: 403 });
      }
    },
  ),

  http.post(`${process.env.EXPO_PUBLIC_API_URL}/users`, async ({ request }) => {
    const timestamp = Date.now();
    const newUser = (await request.json()) as IRegister;

    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      newUser.password + timestamp.toString(),
    );

    const newUserData = {
      id: uuid.v4() as string,
      username: newUser.username as string,
      email: newUser.email as string,
      password: hashedPassword,
      registrationDate: timestamp,
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
    `${process.env.EXPO_PUBLIC_API_URL}/users/:userId`,
    async ({ request, params }) => {
      // @ts-expect-error
      const token = request.headers.map.authorization?.split(' ')[1];
      const { userId } = params;

      if (!token) {
        return HttpResponse.json('Invalid or expired token', { status: 403 });
      }

      if (!userId) {
        return HttpResponse.json('Request failed', { status: 400 });
      }

      try {
        const decode = JWT.decode(
          token,
          process.env.EXPO_PUBLIC_SECRET_KEY as string,
        );

        if (!decode) {
          return HttpResponse.json('Authentication failed', { status: 403 });
        }

        const updatedUser = (await request.json()) as IPublicUser;
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
              password: updatedUser.password
                ? hashedPassword
                : oldData.password,
              firstName: updatedUser.firstName ?? oldData.firstName,
              lastName: updatedUser.lastName ?? oldData.lastName,
              avatar:
                updatedUser.avatar === null
                  ? undefined
                  : (updatedUser.avatar ?? oldData.avatar),
              description: updatedUser.description ?? oldData.description,
              isBanned: updatedUser.isBanned ?? oldData.isBanned,
              totalSuspensions:
                updatedUser.totalSuspensions ?? oldData.totalSuspensions,
              suspensionTimeout:
                updatedUser.suspensionTimeout ?? oldData.suspensionTimeout,
              isConfirmed: updatedUser.isConfirmed ?? oldData.isConfirmed, // @ts-ignore
              messages: updatedUser.messages ?? oldData.messages,
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
        return HttpResponse.json('User not found', { status: 404 });
      } catch (error) {
        return HttpResponse.json('Authentication failed', { status: 403 });
      }
    },
  ),

  http.put(
    `${process.env.EXPO_PUBLIC_API_URL}/users/messages/:userId`,
    async ({ request, params }) => {
      const { userId } = params;
      // @ts-expect-error
      const token = request.headers.map.authorization?.split(' ')[1];
      // @ts-expect-error
      const { message, header, priority } = request.body;

      if (!token) {
        return HttpResponse.json('Invalid or expired token', { status: 403 });
      }

      if (!userId) {
        return HttpResponse.json('Request failed', { status: 400 });
      }

      try {
        const decode = JWT.decode(
          token,
          process.env.EXPO_PUBLIC_SECRET_KEY as string,
        );

        if (!decode) {
          return HttpResponse.json('Authentication failed', { status: 403 });
        }

        const messageBody: IMessage = {
          id: uuid.v4() as string,
          priority,
          header,
          message,
          sendTime: new Date(Date.now()),
          openedTime: null,
        };

        const user = db.user.findFirst({
          where: {
            id: {
              equals: userId as string,
            },
          },
        })!;

        if (user) {
          db.user.update({
            where: {
              id: {
                equals: userId as string,
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
              isConfirmed: user.isConfirmed, // @ts-ignore
              messages: [...user.messages, messageBody],
              role: db.role.findFirst({
                where: {
                  id: {
                    equals: user.role?.id,
                  },
                },
              })!,
            },
          });
          return HttpResponse.json(messageBody, { status: 200 });
        }
        return HttpResponse.json('User not found', { status: 403 });
      } catch (error) {
        return HttpResponse.json('Authentication failed', { status: 403 });
      }
    },
  ),

  http.delete(
    `${process.env.EXPO_PUBLIC_API_URL}/users/:userId`,
    async ({ params, request }) => {
      const { userId } = params;
      // @ts-expect-error
      const token = request.headers.map.authorization?.split(' ')[1];

      if (!token) {
        return HttpResponse.json('Invalid or expired token', { status: 403 });
      }

      if (!userId) {
        return HttpResponse.json('Request failed', { status: 400 });
      }

      try {
        const decode = JWT.decode(
          token,
          process.env.EXPO_PUBLIC_SECRET_KEY as string,
        );

        if (!decode) {
          return HttpResponse.json('Authentication failed', { status: 403 });
        }

        db.user.delete({
          where: {
            id: {
              equals: userId as string,
            },
          },
        });

        return HttpResponse.json();
      } catch (error) {
        return HttpResponse.json('Authentication failed', { status: 403 });
      }
    },
  ),
];
