ALTER TABLE `tr_tugas_header` ADD `attachment` VARCHAR(255) NULL DEFAULT NULL AFTER `assignment_description`;
ALTER TABLE `tr_tugas_header` ADD `kelas_id` INT NOT NULL AFTER `tugas_id`;