"use strict";

/** @type {import('sequelize-cli').Migration} */

const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const users = [
      {
        username: "ucupsurucup",
        email: "ucup@example.com",
        password: bcrypt.hashSync("ucupsurucup", 10),
        name: "Ucup Surucup",
        picture: "ucupsurucup.jpg",
      },
      {
        username: "budinugraha",
        email: "budi@example.com",
        password: bcrypt.hashSync("budinugraha", 10),
        name: "Budi Nugraha",
        picture: "budinugraha.jpg",
      },
      {
        username: "jokomorro",
        email: "joko@example.com",
        password: bcrypt.hashSync("jokomorro", 10),
        name: "Joko Morro",
        picture: "jokomorro.jpg",
      },
      {
        username: "aliceataraxia",
        email: "alice@example.com",
        password: bcrypt.hashSync("aliceataraxia", 10),
        name: "Alice Von Ataraxia",
        picture: "aliceataraxia.jpg",
      },
      {
        username: "sophiaharper",
        email: "sophia@example.com",
        password: bcrypt.hashSync("sophiaharper", 10),
        name: "Sophia Harper",
        picture: "sophiaharper.png",
      },
    ];

    await queryInterface.bulkInsert("users", users);

    const instructors = [
      {
        username: "ucupsurucup",
        document: "ucupsurucup.pdf",
        balance: 0,
        approved: "yes",
        bio: faker.person.bio(),
        rating: 0,
      },
      {
        username: "jokomorro",
        document: "jokomorro.pdf",
        balance: 0,
        approved: "yes",
        bio: faker.person.bio(),
        rating: 0,
      },
      {
        username: "sophiaharper",
        document: "sophiaharper.pdf",
        balance: 0,
        approved: "yes",
        bio: faker.person.bio(),
        rating: 0,
      },
    ];

    await queryInterface.bulkInsert("instructors", instructors);

    const courses = [
      {
        id: uuid.v4(),
        instructor: "ucupsurucup",
        title: faker.word.words(3),
        description: faker.word.words(20),
        rating: 0,
        members: 0,
        preview: "ucupsurucup-course0.jpg",
        price: 250000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/abc-def",
        meet_time: "20:00",
        meet_day: "Monday",
      },
      {
        id: uuid.v4(),
        instructor: "ucupsurucup",
        title: faker.word.words(3),
        description: faker.word.words(20),
        rating: 0,
        members: 0,
        preview: "ucupsurucup-course1.png",
        price: 100000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/gsd-hrg",
        meet_time: "20:00",
        meet_day: "Saturday",
      },
      {
        id: uuid.v4(),
        instructor: "ucupsurucup",
        title: faker.word.words(3),
        description: faker.word.words(20),
        rating: 0,
        members: 0,
        preview: "ucupsurucup-course2.png",
        price: 125000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/kli-fde",
        meet_time: "20:00",
        meet_day: "Sunday",
      },
      {
        id: uuid.v4(),
        instructor: "ucupsurucup",
        title: faker.word.words(3),
        description: faker.word.words(20),
        rating: 0,
        members: 0,
        preview: "ucupsurucup-course3.png",
        price: 99000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/dsf-jgd",
        meet_time: "20:00",
        meet_day: "Tuesday",
      },
      {
        id: uuid.v4(),
        instructor: "jokomorro",
        title: faker.word.words(3),
        description: faker.word.words(20),
        rating: 0,
        members: 0,
        preview: "jokomorro-course0.png",
        price: 300000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/dfg-jkg",
        meet_time: "20:30",
        meet_day: "Wednesday",
      },
      {
        id: uuid.v4(),
        instructor: "jokomorro",
        title: faker.word.words(3),
        description: faker.word.words(20),
        rating: 0,
        members: 0,
        preview: "jokomorro-course1.png",
        price: 230000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/jfg-oiu",
        meet_time: "20:30",
        meet_day: "Thursday",
      },
      {
        id: uuid.v4(),
        instructor: "jokomorro",
        title: faker.word.words(3),
        description: faker.word.words(20),
        rating: 0,
        members: 0,
        preview: "jokomorro-course2.jpg",
        price: 100000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/bfg-ers",
        meet_time: "20:30",
        meet_day: "Monday",
      },
      {
        id: uuid.v4(),
        instructor: "sophiaharper",
        title: faker.word.words(3),
        description: faker.word.words(20),
        rating: 0,
        members: 0,
        preview: "sophiaharper-course0.png",
        price: 275000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/her-fex",
        meet_time: "21:00",
        meet_day: "Friday",
      },
      {
        id: uuid.v4(),
        instructor: "sophiaharper",
        title: faker.word.words(3),
        description: faker.word.words(20),
        rating: 0,
        members: 0,
        preview: "sophiaharper-course1.png",
        price: 145000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/vds-wer",
        meet_time: "21:00",
        meet_day: "Saturday",
      },
    ];

    await queryInterface.bulkInsert("courses", courses);

    const communities = [];

    courses.forEach((course) => {
      communities.push({
        course: course.id,
        name: course.title + " Community",
        type: "local",
      });
    });

    await queryInterface.bulkInsert("communities", communities);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("users", null, {});
  },
};
