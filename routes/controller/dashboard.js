const express = require('express');
const model_kelas = require('../../models/model_kelas');
const router = express.Router();

router.get('/:kelas_code', async function(req, res, next){
    let kelas_code = req.params.kelas_code
    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    })
    var kelas = res_db[0]
    if(err_db){
        console.log(err_db)
    }
    console.log(res_db)
    res.render('app/dashboard', {
        user: req.user,
        page: 'dashboard',
        kelas: kelas
    });
});

module.exports = router;