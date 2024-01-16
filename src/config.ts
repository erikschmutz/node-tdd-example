import { BaseRoute } from "./libs/route";
import modelsRoute from "../src/routes/models";
import entitiesRoute from "../src/routes/entities";
import usersRoute from "../src/routes/users";
import { BaseModel } from "./utils/db";
import Model, { ModelField } from "./models/model";
import Entity, { EntityField } from "./models/entity";
import LoggerService from "./services/logger";
import { BaseService } from "./libs/service";
import User from "./models/user";

export const ROUTES: BaseRoute[] = [modelsRoute, entitiesRoute, usersRoute];
export const MODELS: (typeof BaseModel)[] = [
  Model,
  ModelField,
  Entity,
  EntityField,
  User,
];

export const SERVICES: BaseService[] = [LoggerService];
