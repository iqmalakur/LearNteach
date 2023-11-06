const Model = require("./Model");

class User extends Model {
  static table = "Users";

  constructor(data) {
    super(data, User.table, { username: data.username });
  }

  setPassword(password) {
    this.password = password;
    return this;
  }

  setEmail(email) {
    this.email = email;
    return this;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  static async getAll() {
    return await super.get(User.table);
  }

  static async get(username) {
    const result = await super.get(User.table, { username });

    if (result.length != 0) {
      const { password, email, name } = result;
      return new User(username, password, email, name);
    }

    return null;
  }

  get() {
    const { username, password, email, name } = this;
    return { username, password, email, name };
  }

  static async insert(data) {
    return await Model.insert(User.table, data);
  }

  async save() {
    const { username, password, email, name } = this.get();

    if (await this.isExist())
      return await this.update({ password, email, name });

    return await User.insert({ username, password, email, name });
  }
}

module.exports = User;
