import { Application, Router } from "express";
import { QueryFailedError } from "typeorm";
import { BaseModel, getDatasource } from "../utils/db";
import * as cv from "class-validator";
import HTTPService from "../services/http";
import ErrorService from "../services/error";

export interface BaseRoute {
  path: string;
  register(app: Application | Router): void;
}

interface BaseCrudRouteProps {
  beforeCreate?: (model: BaseModel) => void;
  afterCreate?: (model: BaseModel) => void;
}

export class BaseCrudRoute implements BaseRoute {
  constructor(
    public path: string,
    private model: typeof BaseModel,
    private modelDTO?: any,
    private props: BaseCrudRouteProps = {}
  ) {}

  private responseModel(data: BaseModel[] | BaseModel) {
    return { data, errors: [] };
  }

  private async getById(id: string) {
    return this.model.findOneOrFail({
      where: { id },
      relations: this.model.relations(),
      order: this.model.order(),
    });
  }

  private getErrorMessageAndStatus(error: Error): [number, string] {
    if (error instanceof QueryFailedError) {
      return [422, "Bad query"];
    }

    return [500, "Unkown error"];
  }

  private async getByIdOrNull(id: string) {
    return this.model.findOne({
      where: { id },
      relations: this.model.relations(),
    });
  }

  private isValidModel(m: any) {
    if (!this.modelDTO) return [];

    const model = Object.assign(new this.modelDTO(), m);
    return cv.validateSync(model);
  }

  private isIdInRouteSameAsBody(id: string, body: any) {
    return id === body.id;
  }

  public register(app: Application) {
    app.use("*", (req, res, next) => {
      HTTPService.getEventSource().emit({
        method: req.method as any,
        path: this.path + req.path,
        payload: req.body,
      });

      next();
    });

    app.get("/", async (req, res) => {
      try {
        const model = await this.model.find({
          relations: this.model.relations(),
        });
        res.json(this.responseModel(model));
      } catch (error) {
        ErrorService.getEventSource().emit(error as any);

        const [code, message] = this.getErrorMessageAndStatus(error as Error);
        res.status(code).json({
          errors: [{ message }],
        });
      }
    });

    app.get("/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const model = await this.getById(id);
        res.json(this.responseModel(await model?.transform()));
      } catch (error) {
        ErrorService.getEventSource().emit(error as any);
        const [code, message] = this.getErrorMessageAndStatus(error as Error);
        res.status(code).json({
          errors: [{ message }],
        });
      }
    });

    app.put("/:id", async (req, res) => {
      try {
        const errors = this.isValidModel(req.body);

        if (errors.length > 0) {
          return res.status(422).json({ message: "Invalid model", errors });
        }

        if (!this.isIdInRouteSameAsBody(req.params.id, req.body)) {
          return res
            .status(400)
            .json({ message: "Id in route and body must be the same" });
        }

        const m = await this.getByIdOrNull(req.body.id);

        if (!m) {
          return res.status(404).json({ message: "Not found" });
        }

        const overittenModel = await m.build({ ...req.body });
        await overittenModel.save();
        // const newModel = await this.getById(m.id);
        // res.json(this.responseModel(newModel));
        res.json({ data: await overittenModel?.transform() });
      } catch (error) {
        ErrorService.getEventSource().emit(error as any);
        const [code, message] = this.getErrorMessageAndStatus(error as Error);
        res.status(code).json({
          errors: [{ message }],
        });
      }
    });

    app.post("/", async (req, res) => {
      try {
        const errors = this.isValidModel(req.body);

        if (errors.length > 0) {
          return res.status(422).json({ message: "Invalid model", errors });
        }

        const m = await new this.model().build(req.body);
        await this.props.beforeCreate?.(m);
        await getDatasource().manager.save(this.model, m);
        const newModel = await this.getById(m.id);

        res.json(this.responseModel(await newModel?.transform()));
        await this.props.afterCreate?.(newModel);
      } catch (error) {
        ErrorService.getEventSource().emit(error as any);
        const [code, message] = this.getErrorMessageAndStatus(error as Error);
        res.status(code).json({
          errors: [{ message }],
        });
      }
    });

    app.delete("/:id", async (req, res) => {
      try {
        await getDatasource().manager.delete(this.model, {
          id: req.params.id,
        });
        res.json({ data: { ok: true } });
      } catch (error) {
        ErrorService.getEventSource().emit(error as Error);
        const [code, message] = this.getErrorMessageAndStatus(error as Error);
        res.status(code).json({
          errors: [{ message }],
        });
      }
    });
  }
}

export class HealthCheckRoute implements BaseRoute {
  path = "/.meta/healtcheck";

  register(app: Application): void {
    app.get("/", (_, res) => {
      res.json({ ok: true, message: "Healthcheck ok!" });
    });
  }
}
