/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
  config.port = 8080;
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1705156854979_5706';
  config.proxy = true;
  config.ipHeaders = 'X-Forwarded-For, X-Real-IP';
  // add your middleware config here
  config.middleware = [ 'realIp', 'logger' ];
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.schedule = {
    enable: true,
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.mysql = {
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'track',
    },
    app: true,
    agent: false,
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: 'redis',
      db: 1,
    },
    app: true,
    agent: false,
  };

  config.security = {
    csrf: {
      ignoreJSON: true,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
