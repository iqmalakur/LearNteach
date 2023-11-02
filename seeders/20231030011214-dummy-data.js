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
    // const chats = [];

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

    // Generate Chats
    // for (let [id, community] of communities.entries()) {
    //   const [results, metadata] = await Sequelize.query(
    //     'SELECT Users.username'
    //   );

    //   chats.push({
    //     user: '',
    //     community: id,
    //     chat: faker.lorem.sentences({ min: 1, max: 20 }),
    //     chat_date: new Date(),
    //   });
    // }

    // Generate Wishlists, Carts, and EnrolledCourses
    for (let i = 0; i < 3; i++) {
      for (let [count, user] of users.entries()) {
        if (Math.random() >= 0.5 || i === 2) {
          for (let j = 0; j < Math.round(Math.random() * 3); j++) {
            const indexes = [];

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

                break;
              }
            }
          }
        }
      }
    }

    await queryInterface.bulkInsert('Users', users);
    await queryInterface.bulkInsert('Instructors', instructors);
    await queryInterface.bulkInsert('Courses', courses);
    await queryInterface.bulkInsert('Communities', communities);
    await queryInterface.bulkInsert('Wishlists', wishlists);
    await queryInterface.bulkInsert('Carts', carts);
    await queryInterface.bulkInsert('EnrolledCourses', enrolledCourses);
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
    await queryInterface.bulkDelete('Communities', null, {});
    await queryInterface.bulkDelete('Courses', null, {});
    await queryInterface.bulkDelete('Instructors', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
