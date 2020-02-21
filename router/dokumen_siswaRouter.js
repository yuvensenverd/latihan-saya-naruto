let express = require('express')
var router = express.Router()
const { auth } = require('../helpers/auth')

const { dokumen_siswaController } = require('../controller');

router.post('/getDokumenByType', dokumen_siswaController.getDokumenByType)
router.post('/getDokumenByAdmin', auth, dokumen_siswaController.getDokumenByAdmin)


module.exports = router;