export const getAppConfig = () => ({
  port: parseInt(process.env.PORT || '3000', 10),
});