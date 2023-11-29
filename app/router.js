const router = require("express").Router();

const auth = require("./controllers/auth");
const home = require("./controllers/home");
const instructor = require("./controllers/instructor");
const course = require("./controllers/course");
const user = require("./controllers/user");
const admin = require("./controllers/admin");
const payment = require("./controllers/payment");
const community = require("./controllers/community");

const { checkToken, checkInstructor } = require("./middlewares/authMiddleware");

const multer = require("multer");
const path = require("path");
const { Course } = require("./models/Database");
const sequelize = require("sequelize");
const { verifyToken } = require("./utils/jwt");

const createStorage = (folderLocation, course = false) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public" + folderLocation));
    },
    filename: async (req, file, cb) => {
      if (course) {
        let filename = req.body.prevName ?? "";

        if (req.body.instructor) {
          const courseCount = await Course.findOne({
            where: { instructor: req.body.instructor },
            attributes: [
              [sequelize.fn("COUNT", sequelize.col("*")), "total_course"],
            ],
          });

          filename =
            req.body.prevName ??
            `${req.body.instructor}-course${
              courseCount.dataValues.total_course
            }${path.extname(file.originalname)}`;
        }

        console.log(req);
        console.log(req.body);
        console.log(filename);

        cb(null, filename);
      } else {
        const username = (await verifyToken(req.cookies.token)).username;
        cb(null, username + path.extname(file.originalname));
      }
    },
  });

  return multer({ storage: storage });
};

const uploadPicture = createStorage("/img/profiles/");
const uploadDocument = createStorage("/documents/");
const uploadCoursePreview = createStorage("/img/courses/", true);

// Authentication
router.get("/login", checkToken, auth.login.show); // login page
router.post("/login", auth.login.submit);
router.get("/register", checkToken, auth.register.show); // register page
router.post("/register", auth.register.submit);
router.get("/recovery", checkToken, auth.recovery.show); // recovery password page
router.post("/recovery", auth.recovery.submit);
router.post("/logout", auth.logout);

// Home / Root
router.get("/", checkToken, home.index); // landing page
router.get("/faq", checkToken, home.faq); // FAQ page

// User
router.get("/my", checkToken, user.index); // user dashboard
router.get("/my/profile", checkToken, user.profile); // user profile page
router.put("/my/profile", user.update);
router.put("/my/profile/picture", uploadPicture.single("picture"), user.upload);
router.get("/my/course", checkToken, user.course); // user course page
router.get("/my/quiz", checkToken, user.quiz); // user quiz page
router.get("/wishlist", checkToken, user.wishlist.show); // user wishlist page
router.post("/wishlist", user.wishlist.add);
router.delete("/wishlist", user.wishlist.remove);

// Instructor
router.get("/instructor", checkInstructor, instructor.index); // instructor dashboard page
router.get("/instructor/register", checkInstructor, instructor.register.show); // instructor register page
router.post(
  "/instructor/register",
  uploadDocument.single("document"),
  instructor.register.submit
);
router.get("/instructor/courses", checkInstructor, instructor.course.index); // instructor course page
router.get("/instructor/courses/add", checkInstructor, instructor.course.show); // add course page
router.post(
  "/instructor/courses/add",
  uploadCoursePreview.fields([{ name: "preview", maxCount: 1 }]),
  instructor.course.add
);
router.get(
  "/instructor/courses/:courseId",
  checkInstructor,
  instructor.course.detail
); // class dashboard
router.put("/instructor/courses/:courseId", instructor.course.update);
router.put(
  "/instructor/courses/:courseId/preview",
  uploadCoursePreview.fields([{ name: "preview", maxCount: 1 }]),
  instructor.course.upload
);
router.get(
  "/instructor/courses/:courseId/content",
  checkInstructor,
  instructor.course.content.show
); // add content page
router.post(
  "/instructor/courses/:courseId/content",
  instructor.course.content.submit
);
router.get(
  "/instructor/courses/:courseId/quiz",
  checkInstructor,
  instructor.course.quiz.show
); // add quiz page
router.post(
  "/instructor/courses/:courseId/quiz",
  instructor.course.quiz.submit
);

// Course
router.get("/course", checkToken, course.index); // list of classes page
router.get("/course/:courseId", checkToken, course.detail); // class info page
router.get("/course/:courseId/instructor", checkToken, course.instructor); // instructor info page
router.get("/learn/:courseId", checkToken, course.learn); // learning page

// Community
router.get("/my/community", checkToken, community.index); // community page
router.get("/community/:communityId", checkToken, community.chat); // community chat page

// Payment
router.get("/payment", checkToken, payment.index); // payment page
router.post("/payment", payment.transaction);
router.get("/cart", checkToken, payment.cart.show); // cart page
router.post("/cart", payment.cart.add);
router.delete("/cart", payment.cart.remove);

// Admin
router.get("/admin", admin.index); // dashboard admin
router.get("/admin/login", admin.login); // login admin
router.get("/admin/content", admin.content); // learning content request page
router.get("/admin/user", admin.user); // user list page
router.get("/admin/instructor", admin.instructor.list); // instructor registration list page
router.get("/admin/instructor/:username", admin.instructor.detail); // instructor registration document page

module.exports = router;
