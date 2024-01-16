import { Router } from "express";
import { BaseCrudRoute } from "../libs/route";
import Model from "../models/model";

export default new BaseCrudRoute("/models", Model);
