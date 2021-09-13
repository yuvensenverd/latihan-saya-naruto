var express = require("express");
var router = express.Router();
var { auth, resetToken } = require("../helpers/auth");

const { userController } = require("../controller");

router.post("/register", userController.registerUser);
router.put("/emailVerification", auth, userController.emailVerification);
router.post(
  "/resendEmailVerification",
  auth,
  userController.resendEmailVerification
);
router.post("/keepLogin", auth, userController.keepLogin);
router.post("/login", userController.userLogin);
router.post("/loginGmail", userController.loginWithGoogle);
router.post("/loginFacebook", userController.loginWithFacebook);
router.post("/registerGmail", userController.registerWithGoogle);
router.post("/registerFacebook", userController.registerWithFacebook);
router.get("/getschool", userController.getSchool);
router.get("/getUser", auth, userController.getDataUser);
router.post("/editProfilePic", auth, userController.updateProfilePic);
router.post("/editPhoneNumber", auth, userController.editPhoneNumber);

router.post("/userForgotPassword", userController.getResetPasswordToken);
router.get(
  "/userGetResetToken",
  resetToken,
  userController.userCheckResetToken
);
router.post("/newPasswordUser", resetToken, userController.userResetPassword);
router.post("/userChangePassword", auth, userController.userChangePassword);
router.post("/changePhoneNumber", auth, userController.userChangePhoneNumber);

router.get("/getSubscription/:id", auth, userController.getSubscription);
router.get("/getDonationUser", auth, userController.getDonationUser);
router.get("/scholarshipByIdUser", auth, userController.getScholarshipByUserId);

router.get(
  "/adminGetUserIdAndUserName",
  auth,
  userController.adminGetUserIdAndUserName
);

router.post("/uploadvideo", auth, userController.uploadVideoByAdmin);
router.get("/allvideos", auth, userController.getAllVideo);
router.post("/checkVideos", userController.checkAvailabilityVideo);
router.post("/getVideos", userController.getSelectedVideos);
router.post("/checkSubscription", auth, userController.checkSubscriptionVideo);
router.post("/subcriptionVideo", auth, userController.subcriptionVideo);
router.post("/getQuiz", userController.getQuizWithCode);
router.post("/webHooksVideo", userController.webHooksVideo);

module.exports = router;
