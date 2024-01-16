import * as fs from "fs";
import { getDatasource } from "../src/utils/db";

class Migrator {
  constructor() {}

  query(query: string) {
    return getDatasource().manager.query(query);
  }

  async run() {
    const paths = fs.readdirSync("./migrations/sqls");
    for (const path of paths) {
      if (path.endsWith("up.sql")) {
        const content = fs.readFileSync("./migrations/sqls/" + path, "utf-8");
        await this.query(content);
      }
    }
  }
}

export default Migrator;
