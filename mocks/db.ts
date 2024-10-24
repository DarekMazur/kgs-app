// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
// eslint-disable-next-line import/no-extraneous-dependencies
import { factory, oneOf, manyOf, primaryKey } from '@mswjs/data';

faker.seed(12356);

export const db = factory({
  role: {
    id: primaryKey(faker.number.int),
    name: () => faker.lorem.word(),
    type: () => faker.lorem.word(),
  },
  peak: {
    id: primaryKey(faker.string.uuid),
    name: () => faker.lorem.words({ min: 1, max: 3 }),
    height: () => faker.number.int({ min: 400, max: 700 }),
    description: () => faker.lorem.words({ min: 10, max: 50 }),
    trial: () => faker.lorem.words({ min: 2, max: 5 }),
    localizationLat: () =>
      faker.location.latitude({ max: 51.9194, min: 19.1451 }),
    localizationLng: () =>
      faker.location.longitude({ min: 14.24712, max: 23.89251 }),
    image: () => faker.image.urlLoremFlickr({ category: 'mountains' }),
  },
  post: {
    id: primaryKey(faker.string.uuid),
    author: {
      id: () => faker.string.uuid(),
      username: () => faker.internet.userName(),
      firstName: () => faker.person.firstName(),
      avatar: () => faker.image.avatar(),
      isSuspended: () => faker.datatype.boolean({ probability: 0 }),
      isBanned: () => faker.datatype.boolean({ probability: 0 }),
      role: () => faker.number.int({ min: 1, max: 3 }),
    },
    createdAt: () => faker.date.past(),
    notes: () => faker.lorem.paragraph(),
    photo: () => faker.image.urlLoremFlickr({ category: 'mountains' }),
    peak: oneOf('peak'),
    isHidden: () => faker.datatype.boolean({ probability: 0 }),
  },
  user: {
    id: primaryKey(faker.string.uuid),
    username: () => faker.internet.userName(),
    email: () => faker.internet.email(),
    password: () => faker.internet.password(),
    firstName: () => faker.person.firstName(),
    lastName: () => faker.person.lastName(),
    avatar: () => faker.image.avatar(),
    description: () => faker.person.bio(),
    registrationDate: () => faker.date.past().getTime(),
    isSuspended: () => faker.datatype.boolean({ probability: 0 }),
    isBanned: () => faker.datatype.boolean({ probability: 0 }),
    suspensionTimeout: () => faker.date.future(),
    totalSuspensions: () => 0,
    posts: manyOf('post'),
    role: oneOf('role'),
  },
});
