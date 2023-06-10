const mysql = require('../module/mysql_module')

module.exports = {
    insert_materi: async function(data) {
        try {
            await mysql.connectAsync()
            var sql = "INSERT INTO ms_materi (kelas_id, judul, description, posted_by) VALUES (?,?,?,?)"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.kelas_id, data.judul, data.description, data.posted_by])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    insert_materi_attachment: async function(data) {
        try {
            await mysql.connectAsync()
            var sql = "INSERT INTO tr_materi_attachment (materi_id, attachment) VALUES ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_all_materi_by_kelas: async function(data){
        try {
            await mysql.connectAsync()
            var sql = "SELECT * FROM ms_materi WHERE kelas_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.kelas_id])
            await mysql.endPool()
            return [result,null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_materi_by_id: async function(data){
        try {
            await mysql.connectAsync()
            var sql = "SELECT * FROM ms_materi WHERE materi_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.materi_id])
            await mysql.endPool()
            return [result,null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_attachment_by_materi_id: async function(data){
        try {
            await mysql.connectAsync()
            var sql = "SELECT * FROM tr_materi_attachment WHERE materi_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.materi_id])
            await mysql.endPool()
            return [result,null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_comment_by_materi_id: async function(data){
        try {
            await mysql.connectAsync()
            var sql = "SELECT * FROM ms_comment mc JOIN tr_comment_attachment tca ON mc.comment_id = tca.comment_id WHERE materi_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.materi_id])
            await mysql.endPool()
            return [result,null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    }
}