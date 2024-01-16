import {
  AfterLoad,
  BeforeInsert,
  Column,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Entity as TOEntity,
} from "typeorm";
import { BaseModel } from "../utils/db";
import Model, { ModelField } from "./model";

@TOEntity({ name: "entity" })
class Entity extends BaseModel {
  @ManyToOne(() => Model, (m) => m.fields, { eager: true })
  @JoinColumn({ name: "model_id" })
  model!: Model;

  @OneToMany(() => EntityField, (ref) => ref.entity, {
    eager: true,
    cascade: true,
  })
  fields!: EntityField[];

  @ManyToMany(() => EntityField, (m) => m.refs)
  refs!: EntityField[];

  async build(args: any) {
    super.build(args);

    const modelFields = await ModelField.find({
      where: {
        model: {
          id: this.model.id,
        },
      },
    });

    const { attributes } = this as any;
    const fields: any[] = [];

    for (const modelField of modelFields) {
      const value = attributes[modelField.name];
      const v = this.fields?.find((field) => field.field.id === modelField.id);

      if (modelField.type === "REFERENCE") {
        fields.push({
          id: v?.id,
          field: modelField,
          refs: Array.isArray(value) ? value : [value],
        });
        continue;
      }

      fields.push({
        id: v?.id,
        field: modelField,
        value: { d: value },
      });
    }

    this.fields = fields;

    return this;
  }

  async transform() {
    (this as any).attributes = Object.fromEntries(
      (
        await Promise.all(
          this.fields.map(async (field) => {
            if (field.field?.type === "REFERENCE") {
              if (!field.refs) return null as any;
              const result: any = [];

              for (const ref of field.refs) {
                result.push(await ref.transform());
              }

              return [field.field?.name, result];
            }
            return [field.field?.name, field.value?.d];
          })
        )
      ).filter(Boolean)
    );

    return this;
    // delete (this as any).fields;
  }

  static relations() {
    return {
      fields: {
        refs: {
          fields: true,
        },
      },
    };
  }
}

@TOEntity({ name: "entity_field" })
export class EntityField extends BaseModel {
  @ManyToOne(() => Entity, (m) => m.fields)
  @JoinColumn({ referencedColumnName: "id", name: "entity_id" })
  entity!: Entity;

  @ManyToOne(() => ModelField, (m) => m.entityFields, { eager: true })
  @JoinColumn({ referencedColumnName: "id", name: "model_field_id" })
  field!: ModelField;

  @Column({ type: "json" })
  value!: any;

  @ManyToMany(() => Entity, (m) => m.refs, { cascade: true })
  @JoinTable({
    name: "entity_field_reference",
    joinColumn: {
      name: "entity_field_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "entity_id",
      referencedColumnName: "id",
    },
  })
  refs!: any;
}

export default Entity;
