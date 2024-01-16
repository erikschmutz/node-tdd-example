import { BaseModel } from "../utils/db";
import {
  Entity as TOEntity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Column,
  BeforeInsert,
} from "typeorm";
import { withSetters } from "../utils/mixins";

@TOEntity()
class User extends BaseModel {
  static relations() {
    return {};
  }
}

export default User;
