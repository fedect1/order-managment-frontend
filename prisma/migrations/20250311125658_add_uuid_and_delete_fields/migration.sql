/*
  Warnings:

  - Added the required column `RECIPE_UUID` to the `t_av_recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `t_av_recipe` ADD COLUMN `RECIPE_DELETE` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `RECIPE_UUID` VARCHAR(36) NOT NULL;
