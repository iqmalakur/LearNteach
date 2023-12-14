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
      {
        username: "shania",
        email: "shanniacourse@gmail.com",
        password: bcrypt.hashSync("shancoursepw", 10),
        name: "Shannia Putri",
        picture: "shania.jpg",
      },
      {
        username: "mrmatt",
        email: "matthewanders@gmail.com",
        password: bcrypt.hashSync("mattandre25", 10),
        name: "Matthew Anderson",
        picture: "mrmatt.jpg",
      },
      {
        username: "littleenglish",
        email: "littlenglish@gmail.com",
        password: bcrypt.hashSync("MyLittle3ngl1sh", 10),
        name: "Little English Course",
        picture: "littleenglish.jpg",
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
      {
        username: "shania",
        document: "shania.pdf",
        balance: 0,
        approved: "yes",
        bio: faker.person.bio(),
        rating: 0,
      },
      {
        username: "mrmatt",
        document: "mrmatt.pdf",
        balance: 0,
        approved: "yes",
        bio: faker.person.bio(),
        rating: 0,
      },
      {
        username: "littleenglish",
        document: "littleenglish.pdf",
        balance: 0,
        approved: "yes",
        bio: faker.person.bio(),
        rating: 0,
      },
    ];

    await queryInterface.bulkInsert("instructors", instructors);

    const courses = [
      {
        id: "a91317a5-005e-4e17-a2de-d9a1a3a6356e",
        instructor: "mrmatt",
        title: "Academic English: Writing Specialization",
        description:
          "The skills taught in this Specialization will empower you to succeed in any college-level course or professional field. You'll learn to conduct rigorous academic research and to express your ideas clearly in an academic format. In the final Capstone Project, all the knowledge that you've gained over the span of these courses will culminate into an academic research paper on an issue of your choice.",
        rating: 5,
        members: users.length - 2,
        preview: "mrmatt-course2.jpg",
        price: 190000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/bvo-cbcq-xuu",
        meet_time: "19:00:00",
        meet_day: "Saturday",
      },
      {
        id: "d8ce7ac8-f921-4541-be40-dcad87a2dab1",
        instructor: "littleenglish",
        title: "Interviewing and Resume Writing in English Specialization",
        description:
          "This specialization will help you develop the English language strategies and communication skills you need to advance in your professional career. Whether you already have a successful career and are looking to move forward, whether you're looking to change careers, whether you're starting out in the world of work, or whether you're coming back into the world of work after some time away - if you believe in working for more than a paycheck, then this specialization will help you. The core courses cover preparing for a successful job search, including self research and research of the job market and industries of interest; strengthening your interview skills by recognizing what hiring managers are looking for and taking steps to prepare for the types of tough questions today's premier companies use; and preparing a resume, cover letter and supporting business documents. The capstone will allow you to apply the skills you learn in this specialization to your own job search.",
        rating: 5,
        members: users.length - 1,
        preview: "littleenglish-course0.jpg",
        price: 190000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/snu-hpib-sui",
        meet_time: "09:00:00",
        meet_day: "Sunday",
      },
      {
        id: uuid.v4(),
        instructor: "shania",
        title: "English for Career Development",
        description:
          "This course is designed for non-native English speakers who are interested in advancing their careers in the global marketplace.  In this course, you will learn about the job search, application, and interview process in the United States, while comparing and contrasting the same process in your home country. This course will also give you the opportunity to explore your global career path, while building your vocabulary and improving your language skills to achieve your professional goals. The first unit in this course will introduce the U.S. job application process and provide strategies for identifying the jobs that match your interests and skills. Unit 2 will take you through the steps necessary to produce a professional-looking resume. In unit 3, you will work to develop a clear and concise cover letter. The final unit of the course focuses on networking and interview skills.",
        rating: 3,
        members: 10,
        preview: "shania-course0.jpg",
        price: 100000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/ohh-tcqn-hee",
        meet_time: "09:00:00",
        meet_day: "Thursday",
      },
      {
        id: uuid.v4(),
        instructor: "shania",
        title: "English for Common Interactions in the Workplace: Basic Level",
        description:
          "we're often faced with the need to respond appropriately according to what the situation calls for, whether it be related to situations in daily life or the workplace. This course was designed to provide the worker with linguistic tools which will enable greater ease in basic communications in the workplace.   This way, the student will be able to broaden their lexical and grammatical repertoire in English, thus increasing their professional value and skill, and contributing to not only professional but also social mobility. The methodology of self-guided instruction will allow the student to manage their own study time, so that they can integrate coursework with the daily demands of their professional life at a rhythm adequate for their own learning process.  More importantly, the course is held online, distributed massively, and accessible anywhere in the world.",
        rating: 4,
        members: 18,
        preview: "shania-course1.jpg",
        price: 150000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/cdt-zwkr-jgy",
        meet_time: "15:00:00",
        meet_day: "Friday",
      },
      {
        id: uuid.v4(),
        instructor: "shania",
        title:
          "Business English Skills: Navigate Tone, Formality, and Directness in Emails",
        description:
          "This lesson is part of a full course, Business English Networking. Take this lesson to get a short tutorial on the learning objectives covered. To dive deeper into this topic, take the full course. By the end of this lesson, you will be able to: - Distinguish between formal and informal language - Distinguish between direct and indirect language - Choose the appropriate tone based on your relationship with your recipient, the context, and request.",
        rating: 5,
        members: 23,
        preview: "shania-course2.jpg",
        price: 150000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/ekq-okxm-pso",
        meet_time: "20:00:00",
        meet_day: "Sunday",
      },
      {
        id: uuid.v4(),
        instructor: "mrmatt",
        title: "Business English Communication Skills Specialization",
        description:
          "This Specialization is designed to teach you to communicate effectively in English in professional contexts. You will expand your English vocabulary, improve your ability to write and speak in English in both social and professional interactions, and learn terminology and skills that you can apply to business negotiations, telephone conversations, written reports and emails, and professional presentations.",
        rating: 4,
        members: 20,
        preview: "mrmatt-course0.jpg",
        price: 100000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/csq-hvad-mrx",
        meet_time: "10:00:00",
        meet_day: "Thursday",
      },
      {
        id: uuid.v4(),
        instructor: "mrmatt",
        title: "English for Business and Entrepreneurship",
        description:
          "This course is designed for non-native English speakers who are interested in learning more about the global business economy. In this course, you will learn about topics and language necessary to succeed in the international workplace.  You will explore business English through authentic readings and video lectures, while learning about business vocabulary, concepts, and issues. Unit 1 will provide an introduction to entrepreneurship by examining ideas, products, and opportunities. In unit 2, you will learn about the basics of market research, including how to identify an opportunity. The next unit in the course will focus on business plans, why these plans are important, and will give you a chance to practice composing a business plan. In the final unit of the course, we will present basics for funding a business and will help you create a persuasive presentation, or pitch, based on a business plan.",
        rating: 4,
        members: 17,
        preview: "mrmatt-course1.jpg",
        price: 120000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/pqe-nvpc-scq",
        meet_time: "12:00:00",
        meet_day: "Friday",
      },
      {
        id: uuid.v4(),
        instructor: "littleenglish",
        title: "Learn English: Beginning Grammar Specialization",
        description:
          "This specialization is for those who want to study English grammar at the beginning level. Through the three courses in this specialization, you will learn the fundamental features of English grammar such as word forms, verb tenses, and question and answer formation so that you can start your English learning journey on the right path",
        rating: 5,
        members: 21,
        preview: "littleenglish-course1.jpg",
        price: 130000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/twe-asix-vin",
        meet_time: "13:00:00",
        meet_day: "Tuesday",
      },
      {
        id: uuid.v4(),
        instructor: "littleenglish",
        title: "Conversational English Skills",
        description:
          "Do you want to communicate with English speakers fluently? Welcome to our course. The course consists of 6 units with different topics: meeting new people, the people in your life, eating in and eating out, the reason to learn English, good times and bad times, and hobbies. From this course, you will have a good knowledge of conversational English skills in your daily life. We invite you to learn with our teachers and friends from different countries in the videos, such as the United States, the United Kingdom, Ireland, Canada, Australia, and Columbia. Are you ready? Let's go!",
        rating: 5,
        members: 22,
        preview: "littleenglish-course2.jpg",
        price: 170000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/orj-yazg-mxz",
        meet_time: "17:00:00",
        meet_day: "Sunday",
      },
      {
        id: uuid.v4(),
        instructor: "littleenglish",
        title: "Writing in English at University",
        description:
          "This course aims: - to give you an understanding of the conventions of academic writing in English and to teach you the components and benefits of what is called process writing. - to help you to put together your own “toolbox” of academic writing skills, as well as to give you a chance to test out these tools and to reflect on your own development as a writer. - to encourage reflection on discipline specific conventions; although the course deals with generic skills, you will be able to apply these generic skills to meet the particular needs of your own discipline",
        rating: 4,
        members: 20,
        preview: "littleenglish-course3.jpg",
        price: 120000,
        createdAt: new Date(),
        updatedAt: new Date(),
        meet_link: "https://meet.google.com/qzn-meqn-boy",
        meet_time: "22:00:00",
        meet_day: "Friday",
      },
      {
        id: uuid.v4(),
        instructor: "ucupsurucup",
        title: faker.word.words(3),
        description: faker.word.words(20),
        rating: 3,
        members: 9,
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
        rating: 3,
        members: 10,
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
        rating: 4,
        members: 15,
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
        rating: 4,
        members: 13,
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
        rating: 5,
        members: 27,
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
        rating: 4,
        members: 19,
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
        rating: 4,
        members: 12,
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
        rating: 5,
        members: 24,
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
        rating: 4,
        members: 16,
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

    const contents = [
      {
        id: uuid.v4(),
        course: courses[0].id,
        label: "Basic English Grammar",
        approved: "yes",
        video: `${courses[0].id}-content0.mp4`,
        created_at: new Date(),
      },
      {
        id: uuid.v4(),
        course: courses[0].id,
        label: "Improve English Vocabulary",
        approved: "yes",
        video: `${courses[0].id}-content1.mp4`,
        created_at: new Date(),
      },
      {
        id: uuid.v4(),
        course: courses[0].id,
        label: "Vocabulary With Sentence",
        approved: "yes",
        video: `${courses[0].id}-content2.mp4`,
        created_at: new Date(),
      },
      {
        id: uuid.v4(),
        course: courses[0].id,
        label: "English Slang Words",
        approved: "yes",
        video: `${courses[0].id}-content3.mp4`,
        created_at: new Date(),
      },
      {
        id: uuid.v4(),
        course: courses[0].id,
        label: "English Learning Routine",
        approved: "yes",
        video: `${courses[0].id}-content4.mp4`,
        created_at: new Date(),
      },
      {
        id: uuid.v4(),
        course: courses[1].id,
        label: "English Fluency",
        approved: "yes",
        video: `${courses[1].id}-content0.mp4`,
        created_at: new Date(),
      },
      {
        id: uuid.v4(),
        course: courses[1].id,
        label: "Improve English Speaking",
        approved: "yes",
        video: `${courses[1].id}-content1.mp4`,
        created_at: new Date(),
      },
      {
        id: uuid.v4(),
        course: courses[1].id,
        label: "Everyday English Dialogues",
        approved: "yes",
        video: `${courses[1].id}-content2.mp4`,
        created_at: new Date(),
      },
      {
        id: uuid.v4(),
        course: courses[1].id,
        label: "Interview English Dialogue Example",
        approved: "yes",
        video: `${courses[1].id}-content3.mp4`,
        created_at: new Date(),
      },
      {
        id: uuid.v4(),
        course: courses[1].id,
        label: "Job Interviewing",
        approved: "yes",
        video: `${courses[1].id}-content4.mp4`,
        created_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert("contents", contents);

    const enrolledCourses = [];

    users.forEach((user) => {
      if (
        user.username !== courses[0].instructor &&
        user.username !== "budinugraha"
      ) {
        enrolledCourses.push({
          user: user.username,
          course: courses[0].id,
          completed_contents: "false,false,false,false,false",
          rating: 5,
        });
      }

      if (user.username !== courses[1].instructor) {
        enrolledCourses.push({
          user: user.username,
          course: courses[1].id,
          completed_contents:
            user.username === "budinugraha"
              ? "true,true,false,false,false"
              : "false,false,false,false,false",
          rating: 5,
        });
      }
    });

    await queryInterface.bulkInsert("enrolledcourses", enrolledCourses);

    const carts = [
      {
        user: "budinugraha",
        course: courses[0].id,
      },
      {
        user: "budinugraha",
        course: courses[3].id,
      },
      {
        user: "budinugraha",
        course: courses[5].id,
      },
    ];

    await queryInterface.bulkInsert("carts", carts);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("carts", null, {});
    await queryInterface.bulkDelete("enrolledcourses", null, {});
    await queryInterface.bulkDelete("contents", null, {});
    await queryInterface.bulkDelete("communities", null, {});
    await queryInterface.bulkDelete("courses", null, {});
    await queryInterface.bulkDelete("instructors", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};
