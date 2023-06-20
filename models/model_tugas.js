const mysql = require('../module/mysql_module')

module.exports = {
    get_all_tugas_by_kelas: async function(data) {
        try {
            await mysql.connectAsync()
            var sql =  "SELECT * FROM tr_tugas_header WHERE kelas_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.kelas_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_all_submission_by_kelas_and_user: async function(data) {
        try {
            await mysql.connectAsync()
            var arr_input = [data.kelas_id]
            var sql =  "SELECT th.tugas_id,td.*,mu.username FROM tr_tugas_header th JOIN tr_tugas_detail td ON th.tugas_id = td.tugas_header_id LEFT JOIN ms_user mu ON td.user_id = mu.user_id WHERE th.kelas_id = ?"
            if(data.tugas_id){
                sql+=" AND th.tugas_id = ?"
                arr_input.push(data.tugas_id)
            }
            if(data.user_id){
                sql+=" AND td.user_id = ?"
                arr_input.push(data.user_id)
            }
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, arr_input)
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_tugas: async function(data) {
        try {
            await mysql.connectAsync()
            var sql =  "SELECT * FROM tr_tugas_header WHERE tugas_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.tugas_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    insert_tugas: async function(data) {
        try {
            await mysql.connectAsync()
            var sql =  "INSERT INTO tr_tugas_header (tugas_name, kelas_id, posted_by, deadline, assignment_description, attachment) VALUES (?,?,?,?,?,?)"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.tugas_name, data.kelas_id, data.posted_by, data.deadline, data.assignment_description, data.attachment])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    insert_submission: async function(data) {
        try {
            await mysql.connectAsync()
            var sql =  "INSERT INTO tr_tugas_detail (tugas_header_id, user_id, attachment, submission_description) VALUES (?,?,?,?)"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.tugas_header_id, data.user_id, data.attachment, data.submission_description])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    delete_tugas: async function(data) {
        try {
            await mysql.connectAsync()
            var sql =  "DELETE FROM tr_tugas_header WHERE tugas_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.tugas_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    delete_submission: async function(data) {
        try {
            await mysql.connectAsync()
            var sql =  "DELETE FROM tr_tugas_detail WHERE tugas_detail_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.tugas_detail_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
}