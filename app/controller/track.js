const { Controller } = require('egg');
const CryptoJS = require('crypto-js');

class TrackController extends Controller {
  async addUserTrack() {
    const { app_key, user_id, track_id, data_list, signature, t } =
      this.ctx.request.body;

    const app = await this.ctx.service.cache.get(
      `app_info:${app_key}`,
      async () => {
        const dbData = await this.ctx.app.mysql.get('app_info', {
          app_status: 1,
          app_key,
        });

        return dbData;
      }
    );

    if (!app) {
      return;
    }
    const sign = CryptoJS.SHA256(`${app_key}${t}${app.app_secret}`).toString();
    if (signature !== sign) {
      return;
    }

    await this.ctx.service.track.addTrack(
      app_key,
      user_id,
      track_id,
      data_list
    );

    this.ctx.status = 200;
    this.ctx.body = {
      code: 1,
      data: {
        success: true,
      },
    };
  }
}

module.exports = TrackController;
