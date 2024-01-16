abstract class AuthAccess<User, Group, Entity, AccessPolicy> {
  abstract getUser(): void;
  abstract validate(): boolean;
  abstract getGroups(user: User): Group[];

  abstract modify(user: User, type: "USER"): boolean;
  abstract modify(user: Group, type: "GROUP"): boolean;
  abstract modify(user: User | Group, type: string): boolean;
}

export default AuthAccess;
