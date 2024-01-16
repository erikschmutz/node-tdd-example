import { BaseModel } from "../utils/db";
import {
  Entity as TOEntity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Column,
  BeforeInsert,
} from "typeorm";
import Entity, { EntityField } from "./entity";

@TOEntity()
class Model extends BaseModel {
  @Column()
  name?: string;

  @OneToMany(() => ModelField, (ref) => ref.model, {
    cascade: true,
    onDelete: "RESTRICT",
    nullable: false,
  })
  fields!: ModelField[];

  @OneToMany(() => Entity, (ref) => ref.model)
  entities!: Entity[];

  static relations() {
    return {
      fields: true,
    };
  }
}

@TOEntity({ name: "model_field" })
export class ModelField extends BaseModel {
  @ManyToOne(() => Model, (m) => m.fields, {
    orphanedRowAction: "delete",
  })
  @JoinColumn({ referencedColumnName: "id", name: "model_id" })
  model!: Model;

  @OneToMany(() => EntityField, (ref) => ref.entity)
  entityFields!: EntityField[];

  @Column()
  type!: "STRING" | "NUMBER" | "REFERENCE" | "LIST";

  @Column({ type: "json" })
  config!: any;

  @Column({ type: "varchar" })
  name!: any;

  @BeforeInsert()
  validate() {
    if (this.type === "REFERENCE") {
    }
  }
}

export default Model;
