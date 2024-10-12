// eslint-disable-next-line import/no-extraneous-dependencies
import { setupServer } from 'msw/native';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import * as Crypto from 'expo-crypto';
import { handlers } from './handlers';
import { db } from '@/mocks/db';
import { IPeakProps } from '@/lib/types';

export const server = setupServer(...handlers);

server.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url);
});

const demoUserRegistrationTime = faker.date.past().getTime();
const demoUserId = faker.string.uuid();

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
    id: demoUserId,
    email: 'tu@mail.com',
    password: '123',
    username: 'TestUser',
    registrationDate: demoUserRegistrationTime,
  });
  for (let i = 0; i < faker.number.int({ min: 55, max: 70 }); i += 1) {
    db.user.create({
      registrationDate:
        faker.number.int({ min: 0, max: 3 }) === 0
          ? faker.date.recent().getTime()
          : faker.date.past().getTime(),
    });
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

const updateDemoUser = async () => {
  await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `123${demoUserRegistrationTime.toString()}`,
  ).then((hashedPassword) => {
    db.user.update({
      where: {
        id: {
          equals: demoUserId,
        },
      },
      data: {
        password: hashedPassword,
        role: db.role.findFirst({
          where: {
            id: {
              equals: 1,
            },
          },
        })!,
      },
    });
  });
};

const updateDemoUsersWithAllPeaks = async () => {
  const peaks = db.peak.getAll();

  const shuffle = <T>(array: T[]) => {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      // eslint-disable-next-line no-param-reassign
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const shuffledPeaks = shuffle(peaks);

  const demoUserID = faker.string.uuid();
  const demoUserUsername = faker.internet.userName();
  const demoUserFirstName = faker.person.firstName();
  const demoUserAvatar = faker.image.avatar();

  db.user.create({
    id: demoUserID,
    username: demoUserUsername,
    firstName: demoUserFirstName,
    avatar: demoUserAvatar,
  });

  for (let i = 0; i < peaks.length; i += 1) {
    db.post.create({
      author: {
        id: demoUserID,
        username: demoUserUsername,
        firstName: demoUserFirstName,
        avatar: demoUserAvatar,
      },
      peak: db.peak.findFirst({
        where: {
          id: {
            equals: shuffledPeaks[i].id,
          },
        },
      })!,
    });
  }

  db.user.update({
    where: {
      id: {
        equals: demoUserID,
      },
    },
    data: {
      posts: db.post.findMany({
        where: {
          author: {
            id: {
              equals: demoUserID,
            },
          },
        },
      }),
    },
  });
};

updatePosts();
updateUsers();
updateDemoUser();

for (let i = 0; i < faker.number.int({ min: 3, max: 10 }); i += 1) {
  updateDemoUsersWithAllPeaks();
}
