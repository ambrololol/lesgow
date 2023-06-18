const express = require('express');
const model_kelas = require('../../models/model_kelas');
const model_tr_kelas_member = require('../../models/model_tr_kelas_member');
const router = express.Router();
const moment = require('moment');
require('moment/locale/id');
const model_jadwal = require('../../models/model_jadwal');
const model_materi = require('../../models/model_materi');
const model_tugas = require('../../models/model_tugas');

router.get('/:kelas_code', async function(req, res, next){
    let kelas_code = req.params.kelas_code

    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    })
    if(err_db){
        console.log(err_db)
    }
    console.log(res_db)
    var kelas = res_db[0]

    var [res_member, err_member] = await model_tr_kelas_member.get_member({
        kelas_code: kelas_code
    })
    console.log(res_member)
    for (let i = 0; i < res_member.length; i++) {
        res_member[i].last_login = moment(res_member[i].last_login).format("dddd, DD MMM YYYY, HH:mm:ss");
    }

    var [res_jadwal, err_jadwal] = await model_jadwal.get_jadwal({
        kelas_id: kelas.kelas_id
    })
    console.log(res_jadwal)

    var [res_materi, err_materi] = await model_materi.get_all_materi_by_kelas({
        kelas_id: kelas.kelas_id
    })
    res_materi.sort(function(a, b){
        return b.created_at - a.created_at
    });

    var [res_tugas, err_tugas] = await model_tugas.get_all_tugas_by_kelas({
        kelas_id: kelas.kelas_id
    })
    console.log(res_tugas)

    var[db_role, err_db_role] = await model_tr_kelas_member.get_role({
        kelas_code: kelas_code,
        user_id: req.user.user_id
    })
    console.log(db_role[0].role_user,"ROLE")

    var role = db_role[0].role_user;
    var json_input = {
        kelas_id: kelas.kelas_id
    }
    if(db_role[0].role_user != 'guru'){
        json_input.user_id = req.user.user_id
    }
    var [db_history, err_history] = await model_tugas.get_all_submission_by_kelas_and_user(json_input)
    

    const currentDate = moment().startOf('day');
    const filteredJadwal = res_jadwal.filter(jadwal => moment(jadwal.tanggal).startOf('day').isSameOrAfter(currentDate))
    const filteredTugas = res_tugas.filter(tugas => moment(tugas.deadline).startOf('day').isSameOrAfter(currentDate));
    const totalMembers = res_member.length;
    
    var limitMateri = res_materi.slice(0, 3);
    var limitJadwal = filteredJadwal.slice(0, 3);
    var limitTugas = filteredTugas.slice(0,3);

    res.render('app/dashboard', {
        user: req.user,
        page: 'dashboard',
        kelas: kelas,
        kelas_code: kelas_code,
        currentPage: '/dashboard',
        arr_orang : res_member,
        arr_jadwal: limitJadwal,
        arr_materi: limitMateri,
        arr_tugas: limitTugas,
        moment: moment,
        totalMembers: totalMembers,
        role: role,
        history: db_history
    });
});

router.post('/:kelas_code/edit', async function(req, res, next){
    let kelas_code = req.params.kelas_code
    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    })
    let kelas_id = res_db[0].kelas_id
    let edit_nama_kelas = req.body.edit_nama_kelas
    let edit_deskripsi_kelas = req.body.edit_deskripsi_kelas

    if(!edit_deskripsi_kelas || !edit_nama_kelas){
        return res.status(200).send({
            status:"FAILED",
            message:"Bad Request"
        })
    }
    var [res_edit, err_edit] = await model_kelas.edit_kelas({
        kelas_name: edit_nama_kelas,
        kelas_description: edit_deskripsi_kelas,
        kelas_id: kelas_id 
    })

    return res.status(200).send({
        status: "SUCCESS",
        message: "Berhasil edit kelas"
    })

})

router.get('/:kelas_code/kalendar', async function(req, res, next) {
    let kelas_code = req.params.kelas_code;

    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    });
    if (err_db) {
        console.log(err_db);
    }
    var kelas = res_db[0];

    var [resjadwal_db, errjadwal_db] = await model_jadwal.get_jadwal({
        kelas_id: kelas.kelas_id
    });
    if (errjadwal_db) {
        console.log(errjadwal_db);
    }
    var [res_tugas, err_tugas] = await model_tugas.get_all_tugas_by_kelas({
        kelas_id: kelas.kelas_id
    });

    console.log(resjadwal_db)
    var jadwalEvents = resjadwal_db.map(function(event){
        return {
            title: event.class_type,
            start: event.tanggal,
            className: 'event-jadwal'
        }
    })
    var tugasEvents = res_tugas.map(function(event){
        return {
            title: event.tugas_name,
            start: event.deadline,
            className: 'event-tugas'
        }
    })
    var events = jadwalEvents.concat(tugasEvents)
    res.json(events);
});

module.exports = router;