-- CreateTable
CREATE TABLE `t_mdatact` (
    `MDATACT_DATE` DATETIME(0) NOT NULL,
    `MDATACT_SYSTEM` INTEGER NOT NULL,
    `MDATACT_VARIABLE` INTEGER NOT NULL,
    `MDATACT_VALUE` DECIMAL(10, 3) NOT NULL,

    UNIQUE INDEX `MDATACT_IDX_NUM`(`MDATACT_SYSTEM`, `MDATACT_VARIABLE`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_ng_orders` (
    `order_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `job_number` VARCHAR(50) NOT NULL,
    `product_number` VARCHAR(50) NOT NULL,
    `quantity_kg` DECIMAL(10, 2) NOT NULL,
    `consumption_kg_h` DECIMAL(8, 2) NOT NULL,
    `pml_target_g_m` DECIMAL(8, 2) NOT NULL,
    `width_mm` INTEGER NOT NULL,
    `gusset_mm` INTEGER NOT NULL,
    `linea_id` INTEGER NOT NULL,
    `sequence_number` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at_inno` DATETIME(3) NOT NULL,
    `updated_at_ibed` DATETIME(3) NULL,

    INDEX `IDX_ORDERS_LINEA_ID`(`linea_id`),
    INDEX `IDX_ORDERS_STATUS`(`status`),
    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_ng_components` (
    `component_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER UNSIGNED NOT NULL,
    `material_code` VARCHAR(100) NOT NULL,
    `percentage` DECIMAL(5, 2) NOT NULL,
    `gravimetric_position` CHAR(3) NOT NULL,

    INDEX `IDX_COMPONENTS_ORDER_ID`(`order_id`),
    PRIMARY KEY (`component_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_ng_prod_metrics` (
    `order_id` INTEGER UNSIGNED NOT NULL,
    `time_start` DATETIME(0) NOT NULL,
    `time_finish` DATETIME(0) NOT NULL,
    `total_amount_kg` DECIMAL(10, 2) NOT NULL,
    `total_amount_m` DECIMAL(10, 2) NOT NULL,
    `average_kg_h` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_ng_mat_cons` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER UNSIGNED NOT NULL,
    `material_code` VARCHAR(50) NOT NULL,
    `quantity_kg` DECIMAL(10, 2) NOT NULL,

    INDEX `IDX_MAT_CONS_ORDER_ID`(`order_id`),
    INDEX `IDX_MAT_CONS_MATERIAL`(`material_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `t_ng_components` ADD CONSTRAINT `t_ng_components_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `t_ng_orders`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_ng_prod_metrics` ADD CONSTRAINT `t_ng_prod_metrics_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `t_ng_orders`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `t_ng_mat_cons` ADD CONSTRAINT `t_ng_mat_cons_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `t_ng_orders`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;
