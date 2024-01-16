import AuthAccess from "./framework";

export type User = {
  id: string;
};

export type Group = {
  id: string;
  subGroups?: Group[];
  users: User[];
};

export type Entity = {
  id: string;
};

export type AccessPolicy = {
  action?: string;
  affected?: string[];
  entities?: (User | Group)[];
};

export class Client extends AuthAccess<User, Group, {}, {}> {
  getUser(): void {
    throw new Error("Method not implemented.");
  }

  validate(): void {
    throw new Error("Method not implemented.");
  }

  getGroups(user: User): Group[] {
    throw new Error("Method not implemented.");
  }

  modify(user: User, type: "USER"): boolean;
  modify(user: Group, type: "GROUP"): boolean;
  modify(user: User | Group, type: string): boolean;
  modify(user: unknown, type: unknown): boolean {
    throw new Error("Method not implemented.");
  }
}
