import { createProxyMiddleware } from "http-proxy-middleware";

export default function (app) {
  app.use(
    "/", // This matches all requests starting from the root
    createProxyMiddleware({
      target: "http://frameandsash.great-site.net", // Your API base URL
      changeOrigin: true, // Ensures the origin header is changed to match the target
    })
  );
}
