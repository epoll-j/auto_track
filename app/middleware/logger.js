// app/middleware/logger.js

module.exports = () => {
  return async function logger(ctx, next) {
    const start = Date.now();
    try {
      // 在请求开始时记录请求信息
      ctx.logger.info(
        `[Request] IP: ${ctx.realIP} ${ctx.method} ${ctx.url} - Params:`,
        ctx.params,
        'Query:',
        ctx.query,
        'Body:',
        ctx.request.body
      );

      await next();

      const duration = Date.now() - start;
      ctx.logger.info(
        `[Response] ${ctx.method} ${ctx.url} - duration: ${duration}ms`
      );
    } catch (error) {
      ctx.logger.error(`[Error] ${ctx.method} ${ctx.url}`, error);

      // 抛出异常，让其他异常处理的中间件可以捕获
      throw error;
    }
  };
};
