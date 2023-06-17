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
    edit_materi: async function(data) {
        try {
            await mysql.connectAsync()
            var sql = "UPDATE ms_materi SET judul = ?, description = ? WHERE materi_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.judul, data.description, data.materi_id])
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
            var sql = "SELECT ms_materi.*, ms_user.username FROM ms_materi LEFT JOIN ms_user ON ms_materi.posted_by = ms_user.user_id WHERE materi_id = ?"
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
            var sql = `SELECT mc.*,tca.attachment, mu.username, mu.photo_path, (SELECT mu1.username FROM ms_comment mc1 LEFT JOIN ms_user mu1 ON mc1.posted_by = mu1.user_id WHERE mc1.comment_id = mc.parent_comment_id) AS reply_to_username FROM ms_comment mc 
            LEFT JOIN tr_comment_attachment tca ON mc.comment_id = tca.comment_id 
            LEFT JOIN ms_user mu ON mc.posted_by = mu.user_id
            WHERE materi_id = ? ORDER BY parent_comment_id, comment_id ASC`
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
    insert_comment: async function(data){
        try {
            await mysql.connectAsync()
            var sql = "INSERT INTO `ms_comment`(`materi_id`, `diskusi`, `posted_by`, `parent_comment_id`, `super_parent_comment_id`) VALUES (?, ?, ?, ?, ?)"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.materi_id,
                data.diskusi,
                data.posted_by,
                data.parent_comment_id,
                data.super_parent_comment_id])
            await mysql.endPool()
            return [result,null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    insert_comment_attachment: async function(data){
        try {
            await mysql.connectAsync()
            var sql = "INSERT INTO `tr_comment_attachment`(`comment_id`, `attachment`) VALUES ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data])
            await mysql.endPool()
            return [result,null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    delete_materi: async function(data){
        try {
            await mysql.connectAsync()
            var sql = "DELETE FROM ms_materi WHERE kelas_id = ? AND materi_id = ?;"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.kelas_id, data.materi_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    }
}