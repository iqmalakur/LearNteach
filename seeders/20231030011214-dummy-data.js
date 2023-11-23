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
    const contents = [];
    const videos = [];
    const articles = [];
    const quizzes = [];
    const questions = [];
    const multipleChoises = [];

    // Generate 100 Users
    for (let i = 0; i < 100; i++) {
      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync("user12345", 10),
        name: faker.person.fullName(),
        picture: "default.png",
      };

      users.push(user);

      // 1% of Users will become Instructors
      if (Math.random() >= 0.9) {
        // 99% of Instructors are Approved
        const approved = Math.random() >= 0.1 ? "yes" : "no";

        instructors.push({
          username: user.username,
          document: faker.system.filePath(),
          balance: 0,
          approved,
          bio: faker.person.bio(),
          rating: approved === "no" ? 0 : Math.round(Math.random()) + 4,
        });
      }
    }

    users.push(
      {
        username: "luffy",
        email: "luffy@mugiwara.com",
        password: bcrypt.hashSync("luffy12345", 10),
        name: "Monkey D Luffy",
        picture: "luffy.jpg",
      },
      {
        username: "zoro",
        email: "zoro@mugiwara.com",
        password: bcrypt.hashSync("zoro12345", 10),
        name: "Roronoa Zoro",
        picture: "zoro.jpg",
      },
      {
        username: "usopp",
        email: "usopp@mugiwara.com",
        password: bcrypt.hashSync("usopp12345", 10),
        name: "Usopp",
        picture: "usopp.jpg",
      },
      {
        username: "sanji",
        email: "sanji@mugiwara.com",
        password: bcrypt.hashSync("sanji12345", 10),
        name: "Vismoke Sanji",
        picture: "sanji.jpg",
      },
      {
        username: "nami",
        email: "nami@mugiwara.com",
        password: bcrypt.hashSync("nami12345", 10),
        name: "Nami",
        picture: "nami.jpg",
      },
      {
        username: "chopper",
        email: "chopper@mugiwara.com",
        password: bcrypt.hashSync("chopper12345", 10),
        name: "Tony Tony Chopper",
        picture: "chopper.jpg",
      },
      {
        username: "robin",
        email: "robin@mugiwara.com",
        password: bcrypt.hashSync("robin12345", 10),
        name: "Nico Robin",
        picture: "robin.jpg",
      },
      {
        username: "franky",
        email: "franky@mugiwara.com",
        password: bcrypt.hashSync("franky12345", 10),
        name: "Franky",
        picture: "franky.jpg",
      },
      {
        username: "brook",
        email: "brook@mugiwara.com",
        password: bcrypt.hashSync("brook12345", 10),
        name: "Brook",
        picture: "brook.jpg",
      },
      {
        username: "jinbe",
        email: "jinbe@mugiwara.com",
        password: bcrypt.hashSync("jinbe12345", 10),
        name: "Jinbe",
        picture: "jinbe.jpg",
      }
    );

    instructors.push({
      username: "luffy",
      document: faker.system.filePath(),
      balance: 0,
      approved: "yes",
      bio: "I gonna be king of the pirate",
      rating: 5,
    });

    await queryInterface.bulkInsert("Users", users);
    await queryInterface.bulkInsert("Instructors", instructors);

    // Generate Courses from existing Instructors
    for (let instructor of instructors) {
      // Generate Courses only if Instructor Approved
      if (instructor.approved === "yes") {
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
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
            tags: tags.join(","),
            preview: "default.jpg",
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

    courses.push({
      instructor: "luffy",
      title: "Straw Hat",
      description: "The Straw Hat Course",
      rating: 5,
      members: 10,
      tags: "pirate,advanture,action",
      preview: "default.jpg",
      price: 500000,
      createdAt: new Date(),
      updatedAt: new Date(),
      meet_link: faker.internet.url(),
      meet_time: faker.date.future(),
      meet_day: "Sunday",
    });

    await queryInterface.bulkInsert("Courses", courses);

    // Generate Communities
    for (let [id, course] of courses.entries()) {
      communities.push({
        course: id + 1,
        name: `${course.title} Community`,
        description: faker.commerce.productDescription(),
        picture: faker.image.url(),
        type: "local",
      });
    }

    communities.push({
      course: courses.length,
      name: "Straw Hat Community",
      description: "The Straw Hat Community",
      picture: faker.image.url(),
      type: "local",
    });

    await queryInterface.bulkInsert("Communities", communities);

    // Generate Contents
    for (let [courseId, _] of courses.entries()) {
      for (let i = 0; i < Math.ceil(Math.random() * 5); i++) {
        const rand = Math.random();
        let type = "";
        const id = uuid.v4();

        if (rand >= 0.3) {
          type = "video";

          videos.push({
            id,
            file: faker.system.filePath(),
          });
        } else if (rand >= 0.15) {
          type = "quiz";

          quizzes.push({
            id,
            answer_time: Math.round(Math.random() * 5) + 5,
          });
        } else {
          type = "article";

          articles.push({
            id,
            body: faker.lorem.sentences({ min: 10, max: 50 }),
          });
        }

        contents.push({
          id: uuid.v4(),
          course: courseId + 1,
          label: faker.word.words({ count: { min: 5, max: 10 } }),
          approved: "yes",
          type,
        });
      }
    }

    await queryInterface.bulkInsert("Contents", contents);
    await queryInterface.bulkInsert("Videos", videos);
    await queryInterface.bulkInsert("Articles", articles);
    await queryInterface.bulkInsert("Quizzes", quizzes);

    // Generate Questions
    for (let quiz of quizzes) {
      for (let i = 0; i < Math.ceil(Math.random() * 3) + 2; i++) {
        const type = Math.random() > 0.3 ? "choises" : "essay";

        questions.push({
          quiz: quiz.id,
          question_text: faker.word.words({ count: { min: 5, max: 10 } }),
          answer: faker.word.sample(),
          type,
        });

        if (type === "choises") {
          const choises = [];

          for (let j = 0; j < 4; j++) {
            choises[j] = faker.word.sample();
          }

          multipleChoises.push({
            id: questions.length,
            choises: choises.join(","),
          });
        }
      }
    }

    await queryInterface.bulkInsert("Questions", questions);
    await queryInterface.bulkInsert("MultipleChoises", multipleChoises);

    // Generate Promotion Codes
    for (let i = 0; i < 10; i++) {
      promotionCodes.push({
        course: Math.ceil(Math.random() * courses.length),
        code: faker.string.alphanumeric({
          casing: "upper",
          length: { min: 5, max: 10 },
        }),
        discount: Math.ceil(Math.random() * 5) + 5,
        expired: new Date(new Date().getTime() + 864000000),
      });
    }

    await queryInterface.bulkInsert("PromotionCodes", promotionCodes);

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

                  const completedContents = [];
                  const quizGrades = [];

                  const [contents, ___] = await queryInterface.sequelize.query(
                    `SELECT Contents.id, type FROM Contents INNER JOIN Courses ON Contents.course=Courses.id WHERE Courses.id=${index}`
                  );

                  for (let k = 0; k < contents.length; k++) {
                    if (k <= Math.ceil(contents.length / 2)) {
                      completedContents.push("yes");

                      if (contents[k].type === "quiz") {
                        quizGrades.push(
                          `${contents[k].id}:${
                            Math.ceil(Math.random() * 50) + 50
                          }`
                        );
                      }
                    } else {
                      completedContents.push("no");
                    }
                  }

                  enrolledCourses.push({
                    user: user.username,
                    course: index,
                    completed_contents: completedContents.join(","),
                    quiz_grades: quizGrades.join(","),
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

    enrolledCourses.push(
      {
        user: "zoro",
        course: courses.length,
        completed_contents: "",
        quiz_grades: 0,
      },
      {
        user: "usopp",
        course: courses.length,
        completed_contents: "",
        quiz_grades: 0,
      },
      {
        user: "sanji",
        course: courses.length,
        completed_contents: "",
        quiz_grades: 0,
      },
      {
        user: "nami",
        course: courses.length,
        completed_contents: "",
        quiz_grades: 0,
      },
      {
        user: "chopper",
        course: courses.length,
        completed_contents: "",
        quiz_grades: 0,
      },
      {
        user: "robin",
        course: courses.length,
        completed_contents: "",
        quiz_grades: 0,
      },
      {
        user: "franky",
        course: courses.length,
        completed_contents: "",
        quiz_grades: 0,
      },
      {
        user: "brook",
        course: courses.length,
        completed_contents: "",
        quiz_grades: 0,
      },
      {
        user: "jinbe",
        course: courses.length,
        completed_contents: "",
        quiz_grades: 0,
      }
    );

    await queryInterface.bulkInsert("Wishlists", wishlists);
    await queryInterface.bulkInsert("Carts", carts);
    await queryInterface.bulkInsert("EnrolledCourses", enrolledCourses);
    await queryInterface.bulkInsert("Transactions", transactions);

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

    await queryInterface.bulkInsert("Chats", chats);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Transactions", null, {});
    await queryInterface.bulkDelete("EnrolledCourses", null, {});
    await queryInterface.bulkDelete("PromotionCodes", null, {});
    await queryInterface.bulkDelete("Carts", null, {});
    await queryInterface.bulkDelete("Wishlists", null, {});
    await queryInterface.bulkDelete("Chats", null, {});
    await queryInterface.bulkDelete("MultipleChoises", null, {});
    await queryInterface.bulkDelete("Questions", null, {});
    await queryInterface.bulkDelete("Quizzes", null, {});
    await queryInterface.bulkDelete("Articles", null, {});
    await queryInterface.bulkDelete("Videos", null, {});
    await queryInterface.bulkDelete("Contents", null, {});
    await queryInterface.bulkDelete("Communities", null, {});
    await queryInterface.bulkDelete("Courses", null, {});
    await queryInterface.bulkDelete("Instructors", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
