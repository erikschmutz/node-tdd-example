import express, { Router } from "express";
import modelsRoute from "./routes/models";
import { ROUTES } from "./config";

async function getServer() {
  const app = express();

  app.use(express.json());

  ROUTES.forEach((route) => {
    const router = Router();
    route.register(router);
    app.use(route.path, router);
  });

  return app;
}

export default getServer;
