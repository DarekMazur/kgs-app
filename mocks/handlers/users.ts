// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';
import uuid from 'react-native-uuid';
import { db } from '@/mocks/db';
import { IRegisterProps, IUserRequireProps } from '@/lib/types';

export const handlers = [
  http.get(`${process.env.EXPO_PUBLIC_API_URL}/users`, () => {
    return HttpResponse.json(db.user.getAll());
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

  http.post(`${process.env.EXPO_PUBLIC_API_URL}/users`, async ({ request }) => {
    const newUser = (await request.json()) as IRegisterProps;
    console.log(newUser);
    const createdTime = Date.now();

    const newUserData = {
      id: uuid.v4() as string,
      username: newUser.username as string,
      email: newUser.email as string,
      password: newUser.password as string,
      registrationDate: createdTime,
      firstName: undefined,
      lastName: undefined,
      avatar: undefined,
      description: undefined,
      posts: [],
      role: db.role.findFirst({
        where: {
          type: {
            equals: 'user',
          },
        },
      })!,
    };

    db.user.create({ ...newUserData });
    console.log(newUserData);

    return HttpResponse.json(newUserData, { status: 201 });
  }),

  http.put(
    `${process.env.EXPO_PUBLIC_API_URL}/users/:postId`,
    // eslint-disable-next-line consistent-return
    async ({ request }) => {
      const updatedUser = (await request.json()) as IUserRequireProps;

      if (updatedUser) {
        db.user.update({
          where: {
            id: {
              equals: updatedUser.id as string,
            },
          },
          data: {
            username: updatedUser.username as string,
            password: updatedUser.password as string,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            avatar: updatedUser.avatar,
            description: updatedUser.description,
            role: db.role.findFirst({
              where: {
                id: {
                  equals: updatedUser.role?.id,
                },
              },
            })!,
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
