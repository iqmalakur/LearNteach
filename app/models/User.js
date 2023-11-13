const Joi = require("joi");
const Model = require("./Model");

/**
 * Class representing a User.
 *
 * @class User
 */
class User extends Model {
  static table = "Users";

  /**
   * Create a User.
   *
   * @param {Object} data Object with name, username, password, and email property.
   */
  constructor(data) {
    super(data, User.table, { username: data.username });
    this.picture = data.picture ?? "/img/profile/default.png";
  }

  /**
   * Set the User password property.
   *
   * @param {String} password A new password will be set.
   * @return {User} User object with the new password property.
   */
  setPassword(password) {
    this.password = password;
    return this;
  }

  /**
   * Set the User email property.
   *
   * @param {String} email A new email will be set.
   * @return {User} User object with the new email property.
   */
  setEmail(email) {
    this.email = email;
    return this;
  }

  /**
   * Set the User name property.
   *
   * @param {String} name A new name will be set.
   * @return {User} User object with the new name property.
   */
  setName(name) {
    this.name = name;
    return this;
  }

  /**
   * Set the User picture property.
   *
   * @param {String} picture A new picture will be set.
   * @return {User} User object with the new picture property.
   */
  setPicture(picture) {
    this.picture = picture;
    return this;
  }

  /**
   * User validation.
   *
   * @param {Object} data Object with fullname, username, email, password, confirmPassword, and termsCondition property.
   * @return {Joi.ObjectSchema} Object that represents the results of validation
   */
  static validate(data) {
    const schema = Joi.object({
      fullname: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      confirmPassword: Joi.string().required(),
      termsCondition: Joi.boolean().required(),
    });

    return schema.validate(data);
  }

  /**
   * Get all users from database.
   *
   * @return {Promise<Array>} Array of users from database
   */
  static async getAll() {
    return await super.get(User.table);
  }

  /**
   * Get a User with specific username from database.
   *
   * @param {String} username Username of the User to search for.
   * @return {Promise<User | null>}
   */
  static async get(username) {
    const result = await super.get(User.table, { username });

    if (result.length != 0) {
      return new User(result[0]);
    }

    return null;
  }

  /**
   * Get a User with specific email from database.
   *
   * @param {String} email Email of the User to search for.
   * @return {Promise<User | null>}
   */
  static async getEmail(email) {
    const result = await super.get(User.table, { email });

    if (result.length != 0) {
      return new User(result[0]);
    }

    return null;
  }

  /**
   * Get all User properties.
   *
   * @return {Object} User properties contain username, password, email, and name.
   */
  get() {
    const { username, password, email, name, picture } = this;
    return { username, password, email, name, picture };
  }

  /**
   * Insert a new User into database.
   *
   * @param {Object} data Object with name, username, password, and email property.
   * @return {Promise<Boolean>}
   */
  static async insert(data) {
    return await Model.insert(User.table, data);
  }

  /**
   * Save the User changes into database (Insert or Update).
   *
   * @return {Promise<Boolean>}
   */
  async save() {
    const { username, password, email, name, picture } = this.get();

    if (await this.isExist())
      return await this.update({ password, email, name, picture });

    return await User.insert({ username, password, email, name, picture });
  }
}

module.exports = User;
