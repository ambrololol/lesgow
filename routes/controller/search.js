const express = require('express');
const model_kelas = require('../../models/model_kelas');
const router = express.Router();


router.get('/', async function(req, res, next){
    const searchQuery = req.query.kelas_name;

    const [res_db, err_db] = await model_kelas.cari_kelas({
        kelas_name: searchQuery
    })
    if (err_db) {
        console.log(err_db)
    }
    console.log(res_db)
    

    res.render('searchResults', {
        classes: res_kelas
    })
})