const Joi = require("joi");
const Model = require("./Model");
const Instructor = require("./Instructor");

/**
 * Class representing a Course.
 *
 * @class Course
 */
class Course extends Model {
  static table = "Courses";

  /**
   * Create a Course.
   *
   * @param {Object} data Object with these attributes :
   * - **instructor** (contain instructor username)
   * - **title**
   * - **description**
   * - **tags** (each tag is separated by ,)
   * - **preview** (path to preview image)
   * - **price** (in rupiah)
   * - **meet_link** (zoom or gmeet link for mentoring)
   * - **meet_time** (format : HH:MM:SS)
   * - **meet_day** (from sunday to saturday)
   */
  constructor(data) {
    super(data, Course.table, { id: -1 });

    this.id = data.id ?? -1;
    this.description = data.description ?? "";
  }

  /**
   * Set the instructor property.
   *
   * @param {String} username A new instructor username will be set.
   * @return {Course} Course object with the new instructor property.
   */
  setInstructor(username) {
    this.instructor = username;
    return this;
  }

  /**
   * Set the title property.
   *
   * @param {String} title A new title will be set.
   * @return {Course} Course object with the new title property.
   */
  setTitle(title) {
    this.title = title;
    return this;
  }

  /**
   * Set the description property.
   *
   * @param {String} description A new description will be set.
   * @return {Course} Course object with the new description property.
   */
  setDescription(description) {
    this.description = description;
    return this;
  }

  /**
   * Set the tags property.
   *
   * @param {String} tags A new tags will be set.
   * @return {Course} Course object with the new tags property.
   */
  setTags(tags) {
    this.tags = tags;
    return this;
  }

  /**
   * Set the preview property.
   *
   * @param {String} preview A new preview will be set.
   * @return {Course} Course object with the new preview property.
   */
  setPreview(preview) {
    this.preview = preview;
    return this;
  }

  /**
   * Set the price property.
   *
   * @param {String} price A new price will be set.
   * @return {Course} Course object with the new price property.
   */
  setPrice(price) {
    this.price = price;
    return this;
  }

  /**
   * Set the meet properties.
   *
   * @param {String} link A new meet_link will be set.
   * @param {String} time A new meet_time will be set.
   * @param {String} day A new meet_day will be set.
   * @return {Course} Course object with the new meet properties.
   */
  setMeetInfo(link, time, day) {
    this.meet_link = link;
    this.meet_time = time;
    this.meet_day = day;

    return this;
  }

  /**
   * Course validation.
   *
   * @param {Object} data Object with these attributes :
   * - **instructor** (contain instructor username)
   * - **title**
   * - **description**
   * - **tags** (each tag is separated by ,)
   * - **preview** (path to preview image)
   * - **price** (in rupiah)
   * - **meet_link** (zoom or gmeet link for mentoring)
   * - **meet_time** (format : HH:MM:SS)
   * - **meet_day** (from sunday to saturday)
   * @return {Joi.ObjectSchema} Object that represents the results of validation
   */
  static validate(data) {
    const schema = Joi.object({
      instructor: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().optional(),
      tags: Joi.string().required(),
      preview: Joi.string().required().uri(),
      price: Joi.number().required(),
      meet_link: Joi.string().required().uri(),
      meet_time: Joi.string().required(),
      meet_day: Joi.string().required(),
    });

    return schema.validate(data);
  }

  /**
   * Get all courses from database.
   *
   * @return {Promise<Array>} Array of courses from database
   */
  static async getAll() {
    return await super.get(Course.table);
  }

  /**
   * Get a Course with specific course id from database.
   *
   * @param {Number} id id of the Course to search for.
   * @return {Promise<Course | null>}
   */
  static async get(id) {
    const result = await super.get(Course.table, { id });

    if (result.length != 0) {
      return new Course(result[0]);
    }

    return null;
  }

  /**
   * Get an Instructor with specific course id from database.
   *
   * @return {Promise<Instructor | null>}
   */
  async getInstructor() {
    return await Instructor.get(this.instructor);
  }

  /**
   * Insert a new Course into database.
   *
   * @param {Object} data Object with these attributes :
   * - **instructor** (contain instructor username)
   * - **title**
   * - **description**
   * - **tags** (each tag is separated by ,)
   * - **preview** (path to preview image)
   * - **price** (in rupiah)
   * - **meet_link** (zoom or gmeet link for mentoring)
   * - **meet_time** (format : HH:MM:SS)
   * - **meet_day** (from sunday to saturday)
   * @return {Promise<Boolean>}
   */
  static async insert(data) {
    return await Model.insert(User.table, {
      ...data,
      rating: 0,
      members: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Save the Course changes into database (Insert or Update).
   *
   * @return {Promise<Boolean>}
   */
  async save() {
    const data = {
      instructor: this.instructor,
      title: this.title,
      description: this.description,
      tags: this.tags,
      preview: this.preview,
      price: this.price,
      meet_link: this.meet_link,
      meet_time: this.meet_time,
      meet_day: this.meet_day,
    };

    if (await this.isExist()) return await this.update(data);

    return await User.insert(data);
  }
}

module.exports = Course;
