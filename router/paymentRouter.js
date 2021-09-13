var express = require("express");
var router = express.Router();

const { paymentController } = require("../controller");
const { auth } = require("../helpers/auth");

// router.get('/getPayment', paymentController.getPayment )
router.post("/getSnapMd", auth, paymentController.getSnapMd);
router.post("/updatePayment", paymentController.updatePayment);
router.post("/onfailuregetinfo", paymentController.onFailureGetInfo);
router.post("/getHistory", auth, paymentController.getHistory);
router.get("/getHistoryAdmin", auth, paymentController.getHistoryAdmin); // BUTUH PROTEKSI ROLE = USERADMIN
router.post("/getDonasiProject", paymentController.getDonasiProject);
router.post("/getStatus", paymentController.getStatus);
router.post("/getStatusDonationToYayasan", paymentController.getStatus);
// getStatusDonationToYayasan
router.post("/createPayment", paymentController.addPayment);
router.post("/createDonationToYayasan", paymentController.addDonationToYayasan);
router.post(
  "/updateDonationToYayasan",
  paymentController.updateDonationToYayasan
);
// createDonationToYayasan

router.get("/getSubscription", paymentController.getSubscription);
router.post("/applySubscription", paymentController.applySubscription);
router.post("/payout", paymentController.payout);
router.post("/beneficiaries", paymentController.createBeneficiaries);
router.get("/beneficiary_banks", paymentController.getListBank);
router.post("/validateBankAccount", paymentController.validateBankAccount);
router.post("/getpayoutnotif", paymentController.payoutnotif);
router.post("/payouthistory", paymentController.payouthistory);
router.post("/statusiris", paymentController.getstatusiris);
router.post("/cekpayout", paymentController.checkpayout);
router.get("/getlastid", paymentController.getlastid);
router.get("/get_last_donation_id", paymentController.getlastdonationid);
router.post("/paymentcheck", paymentController.paymentcheck);
router.post("/donationcheck", paymentController.donationcheck);
router.post(
  "/addDonationUserViaSystem",
  auth,
  paymentController.addDonationUserViaSystem
);
// donationcheck
module.exports = router;
