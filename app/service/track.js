const Service = require('egg').Service;

class TrackService extends Service {
  async addTrack(app_key, user_id, track_id, data_list) {
    const rows = [];
    for (const data of data_list) {
      rows.push({
        app_key,
        user_id,
        track_id,
        track_time: new Date(data.time),
        track_type: data.type,
        track_params: JSON.stringify(data.params),
      });
    }
    await this.app.mysql.insert('user_track', rows);
    // 获取用户ID
    if (user_id && user_id != '') {
      const userKey = `${app_key}:user:${user_id}`;
      let userId = await this.ctx.service.cache.get(userKey, async () => {
        const dbUser = await this.app.mysql.get('app_user', {
          app_key,
          user_id,
        });
        if (!dbUser) {
          return null;
        }
        return dbUser.id;
      });
      if (userId) {
        // await this.app.mysql.update(
        //   'app_user',
        //   {
        //     login_ip: this.ctx.realIP,
        //   },
        //   {
        //     where: {
        //       id: userId,
        //     },
        //   }
        // );
      } else {
        // 新用户
        const newUser = await this.app.mysql.insert('app_user', {
          app_key,
          user_id,
          login_ip: this.ctx.realIP,
        });
        userId = newUser.insertId;
        // 统计nu
        const nuKey = `${app_key}:nu`;
        await this.app.redis.incr(nuKey);
      }
      // 统计dau
      const dauKey = `${app_key}:dau`;
      await this.app.redis.setbit(dauKey, userId, 1);
    }
  }
}

module.exports = TrackService;
