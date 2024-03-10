// app/schedule/track_task.js
module.exports = {
  schedule: {
    cron: '0 0 0 * * *',
    // interval: '5s',
    type: 'all',
  },
  async task(ctx) {
    const apps = await ctx.app.mysql.select('app_info', {
      where: { app_status: 1 },
    });
    for (const app of apps) {
      const appKey = app.app_key;
      const dauKey = `${appKey}:dau`;
      const nuKey = `${appKey}:nu`;

      const dau = (await ctx.app.redis.bitcount(dauKey)) || 0;
      const nu = (await ctx.app.redis.get(nuKey)) || 0;

      const trackCount = await ctx.app.mysql.query(
        'select track_type, count(track_type) as num from user_track WHERE DATE(create_time) = CURDATE() group by track_type '
      );
      const data = {
        app_key: appKey,
        app_dau: dau,
        app_nu: nu,
        other_params: JSON.stringify(trackCount),
      };
      await ctx.app.mysql.insert('track_statistics', data);
      await ctx.app.redis.del(dauKey);
      await ctx.app.redis.del(nuKey);
    }
  },
};
