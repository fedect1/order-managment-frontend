/*
  Warnings:

  - A unique constraint covering the columns `[linea_id]` on the table `t_ng_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `UNQ_LINE_SEQUENCE` ON `t_ng_orders`;

-- CreateIndex
CREATE UNIQUE INDEX `UNQ_LINE_SEQUENCE` ON `t_ng_orders`(`linea_id`);
