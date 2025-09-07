import { createDirectus, rest } from '@directus/sdk';

import type { Schema } from './types';

export const Client = createDirectus<Schema>(import.meta.env.VITE_DIRECTUS_URL).with(rest());
