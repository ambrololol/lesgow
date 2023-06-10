var express = require('express');
var router = express.Router();

const dashboard = require('./controller/dashboard')
const materi = require('./controller/materi')
const auth = require('./controller/auth')
const tugas = require('./controller/tugas')
const orang = require('./controller/orang')
const public = require('./controller/public')
const listKelas = require('./controller/listKelas')
const jadwal = require('./controller/jadwal')
const profile = require('./controller/profile')

router.get('/', async function(req, res, next){
    let user = null
    if(req.user){
        user = req.user
    }
    res.render('app/landing_page',{
        user:user
    });
})
router.use('/',public)
router.use('/auth', auth)
/* GET home page. */
router.use(async function(req,res,next){
    if(req.isAuthenticated()){
        console.log("LOGGED IN")
        next()
    }else{
        console.log("NOT LOGGED IN")
        res.redirect('/auth/login')
    }
})

router.use('/profile', profile)
router.use('/jadwal', jadwal)
router.use('/list-kelas', listKelas)
router.use('/dashboard', dashboard)
router.use('/materi', materi)
router.use('/tugas', tugas)
router.use('/orang', orang)

module.exports = router;
