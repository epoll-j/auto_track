const Service = require('egg').Service;

class CacheService extends Service {
  async get(key, queryFunc, ex = 3600) {
    const { redis } = this.app;

    let data = await redis.get(key);
    if (data) {
      try {
        const jsonData = JSON.parse(data);
        if (typeof jsonData === 'string') {
          return JSON.parse(jsonData);
        }
        return JSON.parse(data);
      } catch (e) {
        return data;
      }
    }

    data = await queryFunc(key);
    if (data) {
      await redis.set(key, JSON.stringify(data), 'EX', ex);
    }

    return data;
  }
}

module.exports = CacheService;
