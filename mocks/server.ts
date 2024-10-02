// eslint-disable-next-line import/no-extraneous-dependencies
import { setupServer } from 'msw/native';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { handlers } from './handlers';
import { db } from '@/mocks/db';
import { IPeakProps, IUserRequireProps } from '@/lib/types';

export const server = setupServer(...handlers);

server.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url);
});

const createRoles = () => {
  db.role.create({ id: 1, name: 'Administrator', type: 'admin' });
  db.role.create({ id: 2, name: 'Moderator', type: 'mod' });
  db.role.create({ id: 3, name: 'User', type: 'user' });
};

const createPeaks = () => {
  for (let i = 0; i < faker.number.int({ min: 25, max: 40 }); i += 1) {
    db.peak.create();
  }
};

const createUsers = () => {
  db.user.create({
    email: 'tu@mail.com',
    password: '123',
    username: 'TestUser',
  });
  for (let i = 0; i < faker.number.int({ min: 55, max: 70 }); i += 1) {
    db.user.create();
  }
};

const createPosts = () => {
  for (let i = 0; i < faker.number.int({ min: 100, max: 500 }); i += 1) {
    db.post.create();
  }
};

createRoles();
createPeaks();
createUsers();
createPosts();

const users = db.user.getAll();
const posts = db.post.getAll();
const roles = db.role.getAll();

const getID = (model: 'user' | 'peak' | 'post') => {
  const length = db[model].count();

  const element = db[model].getAll()[Math.floor(Math.random() * length)];

  return element.id;
};

const updatePosts = () => {
  posts.forEach((post) => {
    const author = db.user.findFirst({
      where: {
        id: {
          equals: getID('user'),
        },
      },
    });

    const peak = db.peak.findFirst({
      where: {
        id: {
          equals: getID('peak'),
        },
      },
    });

    db.post.update({
      where: {
        id: {
          equals: post.id,
        },
      },
      data: {
        author: {
          id: author?.id,
          username: author?.username,
          firstName: author?.firstName,
          avatar: author?.avatar,
        },
        peak: peak as any | IPeakProps, // eslint-disable-line @typescript-eslint/no-explicit-any
      },
    });
  });
};

const updateUsers = () => {
  users.forEach((author) => {
    const postsList = db.post.findMany({
      where: {
        author: {
          id: {
            equals: author.id,
          },
        },
      },
    });

    db.user.update({
      where: {
        id: {
          equals: author.id,
        },
      },
      data: {
        role: roles[faker.number.int({ min: 0, max: roles.length - 1 })] as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        posts: postsList || [],
      },
    });
  });
};

updatePosts();
updateUsers();
