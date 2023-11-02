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
    const promotionCodes = [];
    const transactions = [];
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
          balance: 0,
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

    // Generate Promotion Codes
    for (let i = 0; i < 10; i++) {
      promotionCodes.push({
        course: Math.ceil(Math.random() * courses.length),
        code: faker.string.alphanumeric({
          casing: 'upper',
          length: { min: 5, max: 10 },
        }),
        discount: Math.ceil(Math.random() * 5) + 5,
        expired: new Date(new Date().getTime() + 864000000),
      });
    }

    await queryInterface.bulkInsert('PromotionCodes', promotionCodes);

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
                  const [course, _] = await queryInterface.sequelize.query(
                    `SELECT Courses.id, Courses.title, Courses.price, Users.name, Users.username FROM Courses INNER JOIN Users ON Courses.instructor=Users.username WHERE Courses.id=${index}`
                  );

                  let promotion_code = null;
                  let discount_percentage = 0;

                  if (Math.random() >= 0.5) {
                    const [promotion_codes, _] =
                      await queryInterface.sequelize.query(
                        `SELECT code, discount, expired FROM PromotionCodes INNER JOIN Courses ON PromotionCodes.course=Courses.id WHERE PromotionCodes.course=${index}`
                      );

                    if (promotion_codes.length != 0) {
                      const promo =
                        promotion_codes[
                          Math.floor(Math.random() * promotion_codes.length)
                        ];

                      promotion_code = promo.code;
                      discount_percentage = promo.discount;
                    }
                  }

                  const transaction = {
                    user: user.username,
                    course: course[0].id,
                    course_title: course[0].title,
                    user_name: user.name,
                    instructor_name: course[0].name,
                    transaction_date: new Date(),
                    discount_percentage,
                    promotion_code,
                  };

                  transaction.course_price = course[0].price;
                  transaction.tax = Math.floor(transaction.course_price * 0.1);
                  transaction.discount =
                    (transaction.discount_percentage / 100) *
                    transaction.course_price;
                  transaction.price =
                    transaction.course_price -
                    transaction.tax -
                    transaction.discount;
                  transaction.total = transaction.price + transaction.tax;

                  transactions.push(transaction);

                  enrolledCourses.push({
                    user: user.username,
                    course: index,
                  });

                  const [instructor, __] = await queryInterface.sequelize.query(
                    `SELECT username, balance FROM Instructors WHERE username='${course[0].username}'`
                  );
                  await queryInterface.sequelize.query(
                    `UPDATE Instructors SET balance=${
                      instructor[0].balance + transaction.price
                    } WHERE username='${instructor[0].username}'`
                  );
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
    await queryInterface.bulkInsert('Transactions', transactions);

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

    await queryInterface.bulkDelete('Transactions', null, {});
    await queryInterface.bulkDelete('EnrolledCourses', null, {});
    await queryInterface.bulkDelete('PromotionCodes', null, {});
    await queryInterface.bulkDelete('Carts', null, {});
    await queryInterface.bulkDelete('Wishlists', null, {});
    await queryInterface.bulkDelete('Chats', null, {});
    await queryInterface.bulkDelete('Communities', null, {});
    await queryInterface.bulkDelete('Courses', null, {});
    await queryInterface.bulkDelete('Instructors', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
