/*
  Warnings:

  - You are about to alter the column `status` on the `t_ng_orders` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[linea_id,sequence_number]` on the table `t_ng_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `t_ng_orders` ADD COLUMN `is_cancelled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `recipe_id` INTEGER NULL,
    MODIFY `status` ENUM('0', '1', '2', '3', '4') NOT NULL;

-- CreateTable
CREATE TABLE `t_ng_line_version` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `line_id` MEDIUMINT NOT NULL,
    `last_updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `version_hash` VARCHAR(64) NOT NULL,

    UNIQUE INDEX `t_ng_line_version_line_id_key`(`line_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `IDX_ORDERS_SEQUENCE` ON `t_ng_orders`(`sequence_number`);

-- CreateIndex
CREATE UNIQUE INDEX `UNQ_LINE_SEQUENCE` ON `t_ng_orders`(`linea_id`, `sequence_number`);
