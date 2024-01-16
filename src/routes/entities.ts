import { Router } from "express";
import { BaseCrudRoute } from "../libs/route";
import Entity from "../models/entity";

export default new BaseCrudRoute("/entities", Entity);
