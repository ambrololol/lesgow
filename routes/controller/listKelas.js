const express = require('express');
const router = express.Router();
const validator = require('validator')
const model_kelas = require('../../models/model_kelas')
const ShortUniqueId = require('short-unique-id');
const { log } = require('console');
const model_tr_kelas_member = require('../../models/model_tr_kelas_member');

router.get('/', async function(req, res, next){
    var user_id = req.user.user_id
    var [res_db, err_db] = await model_kelas.get_kelas_by_user_id({
        user_id: user_id
    })
    console.log(res_db)
    if(err_db){
        console.log(err_db)
    }
    res.render('app/list_kelas', {
        kelas: res_db,
        user: req.user,
        page: 'list-kelas',
        currentPage: '/list-kelas'
    });
    
});

router.post('/', async function(req, res, next){
    let body = req.body
    console.log(body)
    if(validator.isEmpty(body.kelas_name) || validator.isEmpty(body.kelas_description)){
        return res.status(200).send({
            status: "FAILED",
            message: "Field tidak boleh kosong!"
        })
    }
    let code_gen = new ShortUniqueId({ length: 6 });
    let kelas_code = code_gen()
    console.log(kelas_code)
    let kelas_photo = 'group_default.jpg'
    let kelas_cover = 'cover_default.jpg'
    body.kelas_code = kelas_code
    body.kelas_photo = kelas_photo
    body.kelas_cover = kelas_cover
    let [res_db, err_db] = await model_kelas.insert_kelas(body)
    if(err_db){
        console.log(err_db)
    }
    console.log(res_db)
    var id_kelas = res_db.insertId
    var role_user = 'guru'

    let [res_insert_tr_kelas_member, err_insert_tr_kelas_member] = await model_tr_kelas_member.insert_user_and_group({
        user_id: req.user.user_id,
        kelas_id: id_kelas,
        role_user: role_user
    })

    return res.status(200).send({
        status: "SUCCESS",
        message: "Pembuatan kelas berhasil!"
    });
});

// gabung kelas
router.post('/joinkelas', async function(req, res, next){
    let body = req.body
    console.log(body);
    let [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: body.kode_kelas
    })
    if(err_db){
        console.log(err_db)
    }

    if(res_db.length == 0){
        return res.status(200).send({
            status: "FAILED",
            message: "Kelas tidak ditemukan, cek kembali kode yang anda masukkan"
        })
    }

    var data_kelas = res_db[0]
    var id_kelas = data_kelas.kelas_id
    var role_user = 'murid'

    let [res_check_tr_kelas_member, err_check_tr_kelas_member] = await model_tr_kelas_member.get_by_user_and_group({
        user_id: req.user.user_id,
        kelas_id: id_kelas
    })

    if(res_check_tr_kelas_member.length != 0){
        return res.status(200).send({
            status: "FAILED",
            message: "Anda telah masuk ke dalam kelas tersebut"
        })
    }


    let [res_insert_tr_kelas_member, err_insert_tr_kelas_member] = await model_tr_kelas_member.insert_user_and_group({
        user_id: req.user.user_id,
        kelas_id: id_kelas,
        role_user: role_user
    })

    return res.status(200).send({
        status: "SUCCESS",
        message: "Berhasil gabung ke kelas" 
    })
});

// router.post('/delete/:kelas_id', async function(req, res, next){ 
//     let kelas_id = req.params.kelas_id
//     var [res_db, err_db] = await model_kelas.delete_kelas({
//         kelas_id: kelas_id
//     })
//     return res.redirect('back')
// })
// router.post('/update/:kelas_id', async function(req, res, next){
//     let kelas_id = req.params.kelas_id
//     var [res_db, err_db] = await model_kelas.delete_kelas({
//         kelas_id: kelas_id
//     })
// })
module.exports = router;