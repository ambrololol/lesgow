const express = require('express');
const router = express.Router();
const model_kelas = require('../../models/model_kelas');
const model_tr_kelas_member = require('../../models/model_tr_kelas_member');
const moment = require('moment');
const model_materi = require('../../models/model_materi');
const fs = require('fs')
const multer = require('multer')
const path = require('path')
const path_upload_materi = path.join(__dirname, '../../public/attachment/materi')
const uploadMateri = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            if (!fs.existsSync(path_upload_materi)) {
                fs.mkdirSync(path_upload_materi, "0777")
            }
            if(file.fieldname == "upload_materi")
                cb(null, path_upload_materi)
        },
        filename: function(req, file, cb) {
            if(file.fieldname == "upload_materi")
                cb(null, Date.now() + path.extname(file.originalname))
        }
    }),
}).fields([
    { name: 'upload_materi', maxCount: 5 }
])

router.get('/:kelas_code', async function(req, res, next){
    let kelas_code = req.params.kelas_code
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
    var [res_materi, err_materi] = await model_materi.get_all_materi_by_kelas({
        kelas_id: kelas_id
    })

    res.render('app/materi-1', {
        user: req.user,
        page: 'materi',
        kelas: kelas,
        role: role,
        kelas_code: kelas_code,
        materi_arr: res_materi,
        currentPage: '/materi'
    });
});

router.post('/:kelas_code/post_materi', async function(req, res, next){
    uploadMateri(req, res, async function(err) {
        console.log(req.files["upload_materi"])
        console.log(req.body)
        console.log(req.files)
        var file_data = req.files["upload_materi"] ? req.files["upload_materi"] : ""
        var judul = req.body.judul_materi ? req.body.judul_materi : "Materi dari "+req.user.username
        var file_name_array = []
        if(file_data.length != 0){
            for(let i = 0;i<file_data.length;i++){
                file_name_array.push(file_data[i].filename)
            }
        }
        console.log(file_data.length)
        var description = req.body.deskripsi_materi
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
        var [res_insert, err_insert] = await model_materi.insert_materi({
            kelas_id: kelas_id, 
            judul: judul, 
            description: description, 
            posted_by: posted_by
        })
        var materi_id = res_insert.insertId //cari tau caranya cari insertedId
        console.log(res_insert)

        if(file_name_array.length > 0){
            let data_arr = []
            
            for(let i = 0;i<file_name_array.length;i++){
                data_arr.push([materi_id, file_name_array[i]])
            }
            var [res_insert_arr, err_insert_arr] = await model_materi.insert_materi_attachment(data_arr)   
        }

        return res.status(200).send({
            status:"SUCCESS",
            message:"Berhasil menambahkan tugas"
        })
    })
});

router.get('/:kelas_code/detail/:id', async function(req, res, next){
    let kelas_code = req.params.kelas_code
    let materi_id = req.params.id
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
    var [res_materi, err_materi] = await model_materi.get_materi_by_id({
        materi_id: materi_id
    })

    var [res_attachment, err_attachment] = await model_materi.get_attachment_by_materi_id({
        materi_id: materi_id
    })

    var [res_comment, err_comment] = await model_materi.get_comment_by_materi_id({
        materi_id: materi_id
    })

    res.render('app/materidetail', {
        user: req.user,
        page: 'materi',
        kelas: kelas,
        role: role,
        kelas_code: kelas_code,
        res_materi: res_materi,
        res_attachment: res_attachment,
        res_comment: res_comment,
        currentPage: '/materi'
    });
});

router.post('/:kelas_code/delete/:id', async function(req, res, next){
    let kelas_code = req.params.kelas_code
    let materi_id = req.params.id
    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    })
    let kelas_id = res_db[0].kelas_id
    var [res_delete_materi, err_delete_materi] = await model_materi.delete_materi({
        kelas_id: kelas_id,
        materi_id: materi_id
    })
    if(err_delete_materi){
        console.log(err_delete_materi)
    }
    console.log(res_delete_materi)
    return res.redirect('back');
})

module.exports = router;