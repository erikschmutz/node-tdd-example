import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { DataSource, DataSourceOptions } from "typeorm";

let datasource: DataSource | null = null;

export const setupTypeOrmConnection = async (
  entites: (typeof BaseEntity)[],
  options?: DataSourceOptions
) => {
  datasource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT!),
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    entities: entites,
    ...options,
  } as any);

  let connection = await datasource.initialize();
  return connection;
};

export const getDatasource = () => {
  if (datasource === null) {
    throw new Error("Datasource has not been initialized");
  }
  return datasource;
};

@Entity()
export class BaseModel extends BaseEntity {
  @PrimaryColumn({ generated: "uuid" })
  id!: string;

  @Column({ name: "created_at", generated: true })
  createdAt!: Date;

  valid: boolean = true;

  async build(params: any) {
    for (const key in params) {
      (this as any)[key] = params[key];
    }

    return this;
  }

  async transform(): Promise<any> {
    return this;
  }

  static relations() {
    return {};
  }

  static order() {
    return {
      ...Object.fromEntries(
        Object.entries(this.relations()).map(([key]) => {
          return [key, { createdAt: "ASC" }];
        })
      ),
      createdAt: "ASC",
    } as const;
  }

  static async parentIds(id: string): Promise<BaseModel[]> {
    return [];
  }
}
