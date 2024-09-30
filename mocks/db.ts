// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { factory, oneOf, manyOf, primaryKey } from '@mswjs/data';
import { IRoleTypes } from '@/lib/types';

faker.seed(12356);

export const roles: Array<IRoleTypes> = [
  {
    id: 1,
    name: 'Administrator',
    type: 'admin',
  },
  {
    id: 2,
    name: 'Moderator',
    type: 'moderator',
  },
  {
    id: 3,
    name: 'User',
    type: 'user',
  },
];

export const db = factory({
  peak: {
    id: () => primaryKey(() => faker.string.uuid()),
    name: () => faker.lorem.words({ min: 1, max: 3 }),
    height: () => faker.number.int({ min: 400, max: 700 }),
    description: () => faker.lorem.words({ min: 10, max: 50 }),
    trial: () => faker.lorem.words({ min: 2, max: 5 }),
    localizationLat: () => faker.location.latitude(),
    localizationLng: () => faker.location.longitude(),
    image: () => faker.image.urlLoremFlickr({ category: 'mountains' }),
  },
  post: {
    id: () => primaryKey(() => faker.string.uuid()),
    author: oneOf('user'),
    createdAt: () => faker.date.past(),
    notes: () => faker.lorem.paragraph(),
    photo: () => faker.image.urlLoremFlickr({ category: 'mountains' }),
    peak: oneOf('peak'),
  },
  user: {
    id: () => primaryKey(() => faker.string.uuid()),
    username: () => faker.internet.userName(),
    email: () => faker.internet.email(),
    password: () => faker.internet.password(),
    firstName: () => faker.person.firstName(),
    lastName: () => faker.person.lastName(),
    avatar: () => faker.image.avatar(),
    description: () => faker.person.bio(),
    registrationDate: () => faker.date.past(),
    posts: manyOf('post'),
    peaks: manyOf('peak'),
    role: () =>
      roles[faker.number.int({ min: 0, max: roles.length - 1 })] as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  },
});
