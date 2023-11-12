const Joi = require("joi");
const User = require("./User");

/**
 * Class representing a Instructor.
 *
 * @class Instructor
 */
class Instructor extends User {
  static table = "Instructors";

  /**
   * Create a Instructor.
   *
   * @param {Object} data Object with username, document, and bio property.
   */
  constructor(data) {
    super(data, Instructor.table, { username: data.username });

    this.balance = data.balance ?? 0;
    this.approved = data.approved ?? "no";
    this.rating = data.rating ?? 0;
    this.bio = data.bio ?? "";
  }

  /**
   * Set the bio property.
   *
   * @param {String} bio A new bio will be set.
   * @return {Instructor} Instructor object with the new bio property.
   */
  setBio(bio) {
    this.bio = bio;
    return this;
  }

  /**
   * User validation.
   *
   * @param {Object} data Object with username, document, and bio property.
   * @return {Joi.ObjectSchema} Object that represents the results of validation
   */
  static validate(data) {
    const schema = Joi.object({
      username: Joi.string().required(),
      document: Joi.string().required().uri(),
      bio: Joi.string().optional(),
    });

    return schema.validate(data);
  }

  /**
   * Get all instructors from database.
   *
   * @return {Promise<Array>} Array of instructors from database
   */
  static async getAll() {
    return await super.getJoin(
      Instructor.table,
      "Instructors.*, Users.email, Users.name",
      "Users",
      "Instructors.username=Users.username"
    );
  }

  /**
   * Get an Instructor with specific username from database.
   *
   * @param {String} username Username of the Instructor to search for.
   * @return {Promise<Instructor | null>}
   */
  static async get(username) {
    const result = await super.getJoin(
      Instructor.table,
      "Instructors.*, Users.email, Users.name",
      "Users",
      "Instructors.username=Users.username",
      { username }
    );

    if (result.length != 0) {
      return new Instructor(result[0]);
    }

    return null;
  }

  /**
   * Insert a new Instructor into database.
   *
   * @param {Object} data Object with username, document, balance, approved, bio, and rating property.
   * @return {Promise<Boolean>}
   */
  static async insert(data) {
    return await Model.insert(Instructor.table, data);
  }

  /**
   * Save the Instructor changes into database (Insert or Update).
   *
   * @return {Promise<Boolean>}
   */
  async save() {
    const { username, document, balance, approved, bio, rating } = this;

    if (await this.isExist())
      return await this.update({ document, balance, approved, bio, rating });

    return await User.insert({
      username,
      document,
      balance,
      approved,
      bio,
      rating,
    });
  }
}

module.exports = Instructor;
