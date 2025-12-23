import NodeCache from 'node-cache';
import { SERVER_CONSTANTS } from '../utils/constants.js';

const cache = new NodeCache({
  stdTTL: SERVER_CONSTANTS.CACHE.TTL,
  checkperiod: SERVER_CONSTANTS.CACHE.CHECK_PERIOD
});

export function getCache(): NodeCache {
  return cache;
}

export default cache;
