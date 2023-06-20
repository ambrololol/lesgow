const express = require('express');
const router = express.Router();
const model_kelas = require('../../models/model_kelas');
const model_jadwal = require('../../models/model_jadwal');
const model_tr_kelas_member = require('../../models/model_tr_kelas_member')
const moment = require('moment');
require('moment/locale/id');

router.get('/:kelas_code', async function(req, res, next){
    let kelas_code = req.params.kelas_code
    let user_id = req.user.user_id
    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    })
    if(err_db){
        console.log(err_db)
    }
    console.log(res_db)
    var kelas = res_db[0]

    var [resjadwal_db, errjadwal_db] = await model_jadwal.get_jadwal({
        kelas_id: kelas.kelas_id
    })
    console.log(resjadwal_db)
    if(errjadwal_db){
        console.log(errjadwal_db)
    }
    let [db_role, db_err_role] = await model_tr_kelas_member.get_role({
        kelas_code: kelas_code,
        user_id: user_id
    })
    console.log(db_role[0].role_user,"ROLE")
    var role = db_role[0].role_user;

    var upcomingSchedules = resjadwal_db.filter(data => moment(data.tanggal).isAfter(moment()));
    var pastSchedules = resjadwal_db.filter(data => moment(data.tanggal).isBefore(moment()));

    res.render('app/jadwal', {
        user: req.user,
        page: 'jadwal',
        kelas: kelas,
        jadwal: resjadwal_db,
        upcomingSchedules: upcomingSchedules,
        pastSchedules: pastSchedules,
        moment: moment,
        role: role,
        currentPage: '/jadwal'
    });
});

router.post('/:kelas_code/post_jadwal', async function(req, res, next){
    let kelas_code = req.params.kelas_code
    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    })
    if(err_db){
        console.log(err_db)
    }
    console.log(res_db)
    let data_kelas = res_db[0]
    id_kelas = data_kelas.kelas_id

    let body = req.body
    for(let keys in body){
        if(!body[keys]){
            return res.status(200).send({
                status: "FAILED",
                message: "Field tidak boleh kosong!"
            })
        }
    }
    let [res_insert_jadwal, err_insert_jadwal] = await model_jadwal.insert_jadwal({
        kelas_id: id_kelas,
        tanggal: body.deadlineTugas,
        class_type: body.class_type,
        description: body.description,
        class_location: body.class_location
    })
    
    return res.status(200).send({
        status: "SUCCESS",
        message: "Berhasil membuat jadwal baru"
    })
});

router.post('/:kelas_code/delete/:jadwal_id', async function(req, res, next){
    let kelas_code = req.params.kelas_code
    let jadwal_id = req.params.jadwal_id
    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    })
    let data_kelas = res_db[0]
    id_kelas = data_kelas.kelas_id

    var [res_delete_jadwal, err_delete_jadwal] = await model_jadwal.delete_jadwal({
        kelas_id: id_kelas,
        jadwal_id: jadwal_id
    })
    if(err_delete_jadwal){
        console.log(err_delete_jadwal);
    }
    console.log(res_delete_jadwal)
    
    return res.redirect('back');
});

router.post('/:kelas_code/update/',async function(req, res, next){
    console.log(req.body)
    let kelas_code = req.params.kelas_code
    let jadwal_id = req.body.id_edit_jadwal
    let edit_tanggal = req.body.deadlineTugas
    let edit_class_type = req.body.edit_class_type
    let edit_deskripsi_jadwal = req.body.edit_deskripsi_jadwal
    let edit_lokasi = req.body.edit_lokasi
    
    var[res_jadwal, err_jadwal] = await model_jadwal.get_jadwal({
        kelas_code: kelas_code
    })
    let data = res_jadwal[0]

    var [res_edit, err_edit] = await model_jadwal.update_jadwal({
        tanggal: edit_tanggal,
        class_type: edit_class_type,
        description: edit_deskripsi_jadwal,
        class_location: edit_lokasi,
        jadwal_id: jadwal_id
    })

    return res.status(200).send({
        status: "SUCCESS",
        message: "Berhasil mengubah jadwal"
    })
})

module.exports = router;