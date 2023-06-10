CREATE TABLE ms_user(
user_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
username VARCHAR(120) DEFAULT NULL,
email VARCHAR(50) DEFAULT NULL,
password TEXT DEFAULT NULL,
photo_path VARCHAR(255) DEFAULT NULL,
last_login VARCHAR(50) DEFAULT NULL,
mobile_number VARCHAR(25) DEFAULT NULL,
address TEXT DEFAULT NULL,
gender ENUM('Male', 'Female') NOT NULL,
created_at timestamp NOT NULL DEFAULT current_timestamp(),
updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

CREATE TABLE ms_kelas(
kelas_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
kelas_name VARCHAR(100) DEFAULT NULL,
kelas_code VARCHAR(10) DEFAULT NULL,
kelas_description TEXT DEFAULT NULL,
kelas_cover VARCHAR(255) DEFAULT NULL,
kelas_photo VARCHAR(255) DEFAULT NULL,
created_at timestamp NOT NULL DEFAULT current_timestamp(),
updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

CREATE TABLE ms_jadwal(
jadwal_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
kelas_id INT DEFAULT NULL,
tanggal VARCHAR(10) DEFAULT NULL,
description TEXT DEFAULT NULL,
weekly_active VARCHAR(255) DEFAULT NULL,
duration_hour VARCHAR(255) DEFAULT NULL,
is_active INT DEFAULT 1,
class_type ENUM('online','offline') NOT NULL,
class_location VARCHAR(100) DEFAULT NULL,
created_at timestamp NOT NULL DEFAULT current_timestamp(),
updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
FOREIGN KEY (kelas_id) REFERENCES ms_kelas(kelas_id) ON DELETE SET NULL
);

CREATE TABLE ms_materi(
materi_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
kelas_id INT DEFAULT NULL,
judul VARCHAR(100) DEFAULT NULL,
description TEXT DEFAULT NULL,
posted_by INT DEFAULT NULL,
created_at timestamp NOT NULL DEFAULT current_timestamp(),
updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
FOREIGN KEY (kelas_id) REFERENCES ms_kelas(kelas_id) ON DELETE SET NULL,
FOREIGN KEY (posted_by) REFERENCES ms_user(user_id) ON DELETE
SET NULL
);

CREATE TABLE ms_comment(
comment_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
materi_id INT DEFAULT NULL,
diskusi TEXT DEFAULT NULL,
posted_by INT DEFAULT NULL,
parent_comment_id INT DEFAULT NULL,
created_at timestamp NOT NULL DEFAULT current_timestamp(),
updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
FOREIGN KEY (materi_id) REFERENCES ms_materi(materi_id) ON DELETE SET NULL,
FOREIGN KEY (posted_by) REFERENCES ms_user(user_id) ON DELETE
SET NULL
);

CREATE TABLE tr_materi_attachment(
    materi_attachment_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    materi_id INT DEFAULT NULL,
    attachment VARCHAR(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    FOREIGN KEY (materi_id) REFERENCES ms_materi(materi_id) ON DELETE SET NULL
);

CREATE TABLE tr_comment_attachment(
    comment_attachment_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    comment_id INT DEFAULT NULL,
    attachment VARCHAR(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    FOREIGN KEY (comment_id) REFERENCES ms_comment(comment_id) ON DELETE SET NULL
);

CREATE TABLE tr_tugas_header(
    tugas_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    tugas_name VARCHAR(100) DEFAULT NULL,
    posted_by INT DEFAULT NULL,
    deadline timestamp DEFAULT current_timestamp(),
    assignment_description TEXT DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    FOREIGN KEY (posted_by) REFERENCES ms_user(user_id) ON DELETE SET NULL
);

CREATE TABLE tr_tugas_detail(
    tugas_detail_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    tugas_header_id INT DEFAULT NULL,
    user_id INT DEFAULT NULL,
    attachment VARCHAR(255) DEFAULT NULL,
    submission_description TEXT DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    FOREIGN KEY (tugas_header_id) REFERENCES tr_tugas_header(tugas_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES ms_user(user_id) ON DELETE SET NULL
);

CREATE TABLE tr_kelas_member(
    kelas_member_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    kelas_id INT DEFAULT NULL,
    role_user ENUM('guru', 'murid') NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    FOREIGN KEY (kelas_id) REFERENCES ms_kelas(kelas_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES ms_user(user_id) ON DELETE SET NULL
);

CREATE TABLE ms_notification(
    notif_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    notif_caption TEXT DEFAULT NULL,
    user_id INT DEFAULT NULL,
    kelas_id INT DEFAULT NULL,
    posted_by INT DEFAULT NULL,
    notif_category VARCHAR(50) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    FOREIGN KEY (kelas_id) REFERENCES ms_kelas(kelas_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES ms_user(user_id) ON DELETE SET NULL
);


