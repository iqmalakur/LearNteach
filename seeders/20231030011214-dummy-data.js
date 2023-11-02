'use strict';

/** @type {import('sequelize-cli').Migration} */

const { faker } = require('@faker-js/faker');

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

    const users = [];
    const instructors = [];
    const courses = [];
    const enrolledCourses = [];
    const wishlists = [];
    const carts = [];
    const communities = [];
    const chats = [];

    // Generate 100 Users
    for (let i = 0; i < 100; i++) {
      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
      };

      users.push(user);

      // 1% of Users will become Instructors
      if (Math.random() >= 0.9) {
        // 99% of Instructors are Approved
        const approved = Math.random() >= 0.1 ? 'yes' : 'no';

        instructors.push({
          username: user.username,
          document: faker.system.filePath(),
          approved,
          bio: faker.person.bio(),
          rating: approved === 'no' ? 0 : Math.round(Math.random()) + 4,
        });
      }
    }

    await queryInterface.bulkInsert('Users', users);
    await queryInterface.bulkInsert('Instructors', instructors);

    // Generate Courses from existing Instructors
    for (let instructor of instructors) {
      // Generate Courses only if Instructor Approved
      if (instructor.approved === 'yes') {
        const days = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ];

        // Generate 1 or 2 Courses per Instructor
        for (let i = 0; i < Math.ceil(Math.random() * 2); i++) {
          const tags = [];

          // Generate 1, 2, or 3 dummy tags
          for (let j = 0; j < Math.ceil(Math.random() * 3); j++) {
            tags[j] = faker.word.sample();
          }

          courses.push({
            instructor: instructor.username,
            title: faker.word.words({ min: 2, max: 5 }),
            description: faker.lorem.sentence(),
            rating: Math.round(Math.random()) + 4,
            members: Math.ceil(Math.random() * (users.length / 2)) + 4,
            tags: tags.join(','),
            preview: faker.image.url(),
            price: Math.floor(faker.finance.amount(1, 5)) * 100000,
            createdAt: new Date(),
            updatedAt: new Date(),
            meet_link: faker.internet.url(),
            meet_time: faker.date.future(),
            meet_day: days[Math.floor(Math.random() * days.length)],
          });
        }
      }
    }

    await queryInterface.bulkInsert('Courses', courses);

    // Generate Communities
    for (let [id, course] of courses.entries()) {
      communities.push({
        course: id + 1,
        name: `${course.title} Community`,
        description: faker.commerce.productDescription(),
        picture: faker.image.url(),
        type: 'local',
      });
    }

    await queryInterface.bulkInsert('Communities', communities);

    // Generate Wishlists, Carts, and EnrolledCourses
    for (let i = 0; i < 3; i++) {
      for (let user of users) {
        if (Math.random() >= 0.5 || i === 2) {
          const indexes = [];

          // Generate 0-3 row for Wishlists, Carts, and EnrolledCourses
          for (let j = 0; j < Math.round(Math.random() * 3); j++) {
            // Generate unique index for Wishlist and Cart
            while (true) {
              const index = Math.ceil(Math.random() * courses.length);

              if (!indexes.includes(index)) {
                if (i === 0) {
                  wishlists.push({
                    user: user.username,
                    course: index,
                  });
                } else if (i === 1) {
                  carts.push({
                    user: user.username,
                    course: index,
                  });
                } else {
                  enrolledCourses.push({
                    user: user.username,
                    course: index,
                  });
                }

                indexes.push(index);
                break;
              }
            }
          }
        }
      }
    }

    await queryInterface.bulkInsert('Wishlists', wishlists);
    await queryInterface.bulkInsert('Carts', carts);
    await queryInterface.bulkInsert('EnrolledCourses', enrolledCourses);

    // Generate Chats
    for (let [id, community] of communities.entries()) {
      const [users, _] = await queryInterface.sequelize.query(
        `SELECT username FROM EnrolledCourses INNER JOIN Users ON EnrolledCourses.user=Users.username WHERE EnrolledCourses.course=${community.course}`
      );

      for (let user of users) {
        for (let i = 0; i < Math.round(Math.random() * 5); i++) {
          chats.push({
            user: user.username,
            community: id + 1,
            chat: faker.lorem.sentences(),
            chat_date: new Date(),
          });
        }
      }
    }

    await queryInterface.bulkInsert('Chats', chats);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('EnrolledCourses', null, {});
    await queryInterface.bulkDelete('Carts', null, {});
    await queryInterface.bulkDelete('Wishlists', null, {});
    await queryInterface.bulkDelete('Chats', null, {});
    await queryInterface.bulkDelete('Communities', null, {});
    await queryInterface.bulkDelete('Courses', null, {});
    await queryInterface.bulkDelete('Instructors', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
