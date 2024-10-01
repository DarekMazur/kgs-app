// eslint-disable-next-line import/no-extraneous-dependencies
import { http, HttpResponse } from 'msw';
import uuid from 'react-native-uuid';
import { db } from '@/mocks/db';
import { IRegisterProps, IUserRequireProps } from '@/lib/types';

export const handlers = [
  http.get('http://localhost/api/users', () => {
    return HttpResponse.json(db.user.getAll());
  }),

  http.get('http://localhost/api/users/:userId', async ({ params }) => {
    const { userId } = params;
    return HttpResponse.json(
      db.user.getAll().filter((user) => user.id === userId),
    );
  }),

  http.post('http://localhost/api/users', async ({ request }) => {
    const newUser = (await request.json()) as IRegisterProps;
    const createdTime = Date.now();

    db.user.create({
      id: uuid.v4() as string,
      username: newUser.username as string,
      email: newUser.email as string,
      password: newUser.password as string,
      registrationDate: createdTime,
      role: db.role.findFirst({
        where: {
          type: {
            equals: 'user',
          },
        },
      })!,
    });

    return HttpResponse.json(newUser, { status: 201 });
  }),

  // eslint-disable-next-line consistent-return
  http.put('http://localhost/api/users/:postId', async ({ request }) => {
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
                equals: updatedUser.role.id,
              },
            },
          })!,
        },
      });

      return HttpResponse.json(updatedUser, { status: 201 });
    }
  }),

  http.delete('http://localhost/api/users/:userId', async ({ params }) => {
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
  }),
];
