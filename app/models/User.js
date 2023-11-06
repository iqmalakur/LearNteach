const Model = require("./Model");

class User extends Model {
  static table = "Users";

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

  static async update(data, username) {
    return await Model.update(User.table, data, { username });
  }

  async update(data) {
    return await User.update(data, this.username);
  }

  async save() {
    const { username, password, email, name } = this.get();
    const exist = await User.get(username);

    console.log(exist);

    if (exist) {
      User.update({ password, email, name });
      return;
    }

    User.insert({ username, password, email, name });
  }

  static async delete(username) {
    return await Model.delete(User.table, { username });
  }

  async delete() {
    return await User.delete(this.username);
  }
}

module.exports = User;
