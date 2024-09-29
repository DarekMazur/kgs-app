// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';

export default [
  {
    id: faker.string.uuid(),
    username: 'testUser',
    email: 'tu@e.mail',
    password: '123',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    avatar: faker.image.avatar(),
    joinAt: faker.date.past(),
    description: faker.person.bio(),
  },
  {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    avatar: faker.image.avatar(),
    joinAt: faker.date.past(),
    description: faker.person.bio(),
  },
  {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    avatar: faker.image.avatar(),
    joinAt: faker.date.past(),
    description: faker.person.bio(),
  },
  {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    avatar: faker.image.avatar(),
    joinAt: faker.date.past(),
    description: faker.person.bio(),
  },
];
