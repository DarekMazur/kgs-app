import { handlers as postHandlers } from './posts';
import { handlers as peakHandlers } from '@/mocks/handlers/peaks';
import { handlers as userHandlers } from '@/mocks/handlers/users';
import { handlers as roleHandlers } from '@/mocks/handlers/roles';

export const handlers = [
  ...postHandlers,
  ...peakHandlers,
  ...userHandlers,
  ...roleHandlers,
];
