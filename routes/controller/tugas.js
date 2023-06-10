const express = require('express');
const router = express.Router();
const model_kelas = require('../../models/model_kelas');
const model_tr_kelas_member = require('../../models/model_tr_kelas_member');
const model_tugas = require('../../models/model_tugas')
const fs = require('fs')
const multer = require('multer')
const path = require('path')
const path_upload_tugas = path.join(__dirname, '../../public/attachment/tugas')
const path_upload_submission = path.join(__dirname, '../../public/attachment/submission')
const moment = require('moment')
const uploadTugas = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            if (!fs.existsSync(path_upload_tugas)) {
                fs.mkdirSync(path_upload_tugas, "0777")
            }
            if(file.fieldname == "upload_tugas")
                cb(null, path_upload_tugas)
        },
        filename: function(req, file, cb) {
            if(file.fieldname == "upload_tugas")
                cb(null, Date.now() + path.extname(file.originalname))
        }
    }),
}).fields([
    { name: 'upload_tugas', maxCount: 1 }
])

const uploadSubmission = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            if (!fs.existsSync(path_upload_submission)) {
                fs.mkdirSync(path_upload_submission, "0777")
            }
            if(file.fieldname == "upload_submission")
                cb(null, path_upload_submission)
        },
        filename: function(req, file, cb) {
            if(file.fieldname == "upload_submission")
                cb(null, Date.now() + path.extname(file.originalname))
        }
    }),
}).fields([
    { name: 'upload_submission', maxCount: 1 }
])



router.get('/:kelas_code', async function(req, res, next){
    let kelas_code = req.params.kelas_code
    let user_id = req.user.user_id

    let [db_role, db_err_role] = await model_tr_kelas_member.get_role({
        kelas_code: kelas_code,
        user_id: user_id
    })

    console.log(db_role[0].role_user,"ROLE")
    var role = db_role[0].role_user
    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    })
    console.log(res_db)
    if(err_db){
        console.log(err_db)
    }
    
    var kelas = res_db[0]
    var kelas_id = kelas.kelas_id
    var [res_tugas, err_tugas] = await model_tugas.get_all_tugas_by_kelas({
        kelas_id: kelas_id
    })
    
    res.render('app/tugas', {
        user: req.user,
        page: 'tugas',
        kelas: kelas,
        role: role,
        kelas_code: kelas_code,
        tugas_arr: res_tugas,
        moment: moment
    });
});

router.post('/:kelas_code/tambah_tugas', async function(req, res, next){
    uploadTugas(req, res, async function(err) {
        console.log(req.files["upload_tugas"])
        console.log(req.body)
        console.log(req.files)
        var file_data = req.files["upload_tugas"] ? req.files["upload_tugas"][0] : ""
        var tugas_name = req.body.judul_tugas ? req.body.judul_tugas : "Tugas dari "+req.user.username
        var file_name = file_data ? file_data.filename : ""
        var assignment_description = req.body.deskripsi
        var deadline = req.body.deadline
        let posted_by = req.user.user_id
        
        let kelas_code = req.params.kelas_code
        var [res_db, err_db] = await model_kelas.get_kelas_by_code({
            kelas_code: kelas_code
        })
        console.log(res_db)
        if(err_db){
            console.log(err_db)
        }
        var kelas_id = res_db[0].kelas_id
        var [res_insert, err_insert] = await model_tugas.insert_tugas({
            tugas_name : tugas_name, 
            kelas_id : kelas_id, 
            posted_by : posted_by, 
            deadline : deadline, 
            assignment_description : assignment_description, 
            attachment: file_name
        })

        return res.status(200).send({
            status:"SUCCESS",
            message:"Berhasil menambahkan tugas"
        })
    })
});

router.post('/:kelas_code/delete_tugas', async function(req, res, next){

    
    let tugas_id = req.body.tugas_id


    var [res_insert, err_insert] = await model_tugas.delete_tugas({
        tugas_id: tugas_id
    })

    return res.status(200).send({
        status:"SUCCESS",
        message:"Berhasil menghapus tugas"
    })
});

router.post('/:kelas_code/delete_submission', async function(req, res, next){

    
    let submission_id = req.body.submission_id


    var [res_insert, err_insert] = await model_tugas.delete_submission({
        tugas_detail_id: submission_id
    })

    return res.status(200).send({
        status:"SUCCESS",
    message:"Berhasil menghapus submission"
    })
});


router.post('/:kelas_code/tambah_submission', async function(req, res, next){
    uploadSubmission(req, res, async function(err) {
        console.log(req.files["upload_submission"])
        console.log(req.body)
        console.log(req.files)
        var file_data = req.files["upload_submission"][0]

        
        if(!req.files['upload_submission']){
            return res.status(200).send({
                status:"FAILED",
                message:"Submission tidak ditemukan"
            })
        }
        var file_name = file_data ? file_data.filename : ""
        var submission_description = req.body.deskripsi_submission
        var tugas_header_id = req.body.id_tugas
        
        let kelas_code = req.params.kelas_code
        let user_id = req.user.user_id
        
        var [res_db, err_db] = await model_kelas.get_kelas_by_code({
            kelas_code: kelas_code
        })
        console.log(res_db)
        if(err_db){
            console.log(err_db)
        }

        var [res_tugas_header, err_tugas_header] = await model_tugas.get_tugas({
            tugas_id: tugas_header_id
        })
        console.log(res_tugas_header)
        if(err_tugas_header){
            console.log(err_tugas_header)
        }
        
        if(moment().isAfter(res_tugas_header[0].deadline)){
            return res.status(200).send({
                status:"FAILED",
                message:"Tugas telah melewati deadline"
            })
        }

        var [res_insert, err_insert] = await model_tugas.insert_submission({
            tugas_header_id : tugas_header_id,
            user_id : user_id,
            attachment : file_name,
            submission_description : submission_description
        })


        return res.status(200).send({
            status:"SUCCESS",
            message:"Berhasil menambahkan submission"
        })
    })
});

router.post('/:kelas_code/get_submission_history', async function(req, res, next){
    let user_id = req.user.user_id
    let kelas_code = req.params.kelas_code
    let [db_role, db_err_role] = await model_tr_kelas_member.get_role({
        kelas_code: kelas_code,
        user_id: user_id
    })

    console.log(db_role[0].role_user,"ROLE")
    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    })
    console.log(res_db)
    if(err_db){
        console.log(err_db)
    }
    var kelas_id = res_db[0].kelas_id
    var json_input = {
        kelas_id: kelas_id
    }
    if(db_role[0].role_user != 'guru'){
        json_input.user_id = req.user.user_id
    }


    var [db_history, err_history] = await model_tugas.get_all_submission_by_kelas_and_user(json_input)
    
    return res.status(200).send({
        status:"SUCCESS",
        message:"Berhasil menambahkan tugas",
        data: db_history
    })
});

router.get('/:kelas_code/edit/:id', async function(req, res, next){
    let kelas_code = req.params.kelas_code
    let tugas_id = req.params.id
    let user_id = req.user.user_id

    let [db_role, db_err_role] = await model_tr_kelas_member.get_role({
        kelas_code: kelas_code,
        user_id: user_id
    })
    console.log(db_role[0].role_user, "ROLE")
    var role = db_role[0].role_user
    
    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    })
    console.log(res_db)
    if(err_db){
        console.log(err_db)
    }
    var kelas = res_db[0]
    var kelas_id = kelas.kelas_id
    
});

module.exports = router;