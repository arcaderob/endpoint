import 'dotenv/config';
import type { ServerConfig } from './types/config.types.js';

// Centralizing environment variables here allows for easier management and ensures type safety across the service.
export const config: ServerConfig = {
  bodyLimit: Number(process.env.BODY_LIMIT) || 1048576, // 1MB
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  replacementLimit: process.env.REPLACEMENT_LIMIT 
    ? parseInt(process.env.REPLACEMENT_LIMIT, 10) 
    : 10,
};

// Simple check and warning for invalid body limit.
if (isNaN(config.bodyLimit)) {
  console.warn('Warning: BODY_LIMIT is not a valid number. Defaulting to 1048576 (1MB).');
  config.bodyLimit = 1048576;
} else {
  console.warn(`BODY_LIMIT is set to ${config.bodyLimit}.`);
}

// Simple check and warning for invalid replacement limit.
if (isNaN(config.replacementLimit)) {
  console.warn('Warning: REPLACEMENT_LIMIT is not a valid number. Defaulting to 10.');
  config.replacementLimit = 10;
} else {
  console.warn(`REPLACEMENT_LIMIT is set to ${config.replacementLimit}.`);
}
