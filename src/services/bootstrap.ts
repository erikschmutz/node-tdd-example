import application from "../application";
import { BaseService } from "../libs/service";
import Entity, { EntityField } from "../models/entity";
import Model, { ModelField } from "../models/model";
import User from "../models/user";
import { getDatasource } from "../utils/db";

class BootstrapUserAccountService implements BaseService {
  register(): void {}

  async setupDefaultEntities(user: User) {
    const usernameField = await new ModelField().build({
      name: "user_id",
      type: "STRING",
    });

    const userModel = new Model();
    userModel.name = "User";
    userModel.fields = [usernameField];

    const userMemberField = await new ModelField().build({
      name: "members",
      type: "REFERENCE",
    });
    const organisationModel = new Model();
    organisationModel.name = "Organisation";
    organisationModel.fields = [userMemberField];

    await userModel.save();
    await organisationModel.save();

    console.log(userModel.id);

    const userEntity = new Entity();
    const userNameField = new EntityField();
    userEntity.model = userModel;

    await userEntity.save();
  }
}

export default new BootstrapUserAccountService();
