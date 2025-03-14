/*
  Warnings:

  - You are about to drop the column `recipe_id` on the `t_ng_orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `t_ng_orders` DROP COLUMN `recipe_id`,
    ADD COLUMN `recipe_uuid` VARCHAR(36) NULL;
