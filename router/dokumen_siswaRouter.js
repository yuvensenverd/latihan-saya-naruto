let express = require('express')
var router = express.Router()

const { dokumen_siswaController } = require('../controller');

router.post('/getDokumenByType', dokumen_siswaController.getDokumenByType)

module.exports = router;