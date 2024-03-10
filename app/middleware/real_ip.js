// app/middleware/real_ip.js
module.exports = () => {
  return async function realIp(ctx, next) {
    // 使用 X-Forwarded-For 头部来获取 IP
    const xForwardedFor = ctx.get('X-Forwarded-For');
    // 使用 X-Real-IP 头部来获取 IP
    const xRealIP = ctx.get('X-Real-IP');
    // 根据配置或默认值获取 IP
    ctx.realIP = xForwardedFor
      ? xForwardedFor.split(', ')[0]
      : xRealIP || ctx.ip;

    // 调用下一个中间件
    await next();
  };
};
