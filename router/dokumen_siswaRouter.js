let express = require('express')
var router = express.Router()
const { auth } = require('../helpers/auth')

const { dokumen_siswaController } = require('../controller');

router.post('/getDokumenByType', dokumen_siswaController.getDokumenByType)
router.post('/getDokumenByAdmin', auth, dokumen_siswaController.getDokumenByAdmin)

router.post('/getDokumenByUser', auth, dokumen_siswaController.getDokumenByUser)
router.post('/updateDokumentById', auth, dokumen_siswaController.updateDokumentById)
router.post('/deleteDokumenById', auth, dokumen_siswaController.deleteDokumenById)

module.exports = router;