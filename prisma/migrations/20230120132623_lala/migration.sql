/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `capacity` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureTime` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Route` ADD COLUMN `capacity` INTEGER NOT NULL,
    ADD COLUMN `departureTime` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` ENUM('admin', 'employee', 'driver') NOT NULL;

-- DropTable
DROP TABLE `Role`;
