/*
  Warnings:

  - Renamed the column `title` on the `Obligation` table to `name`.

*/
-- AlterTable
ALTER TABLE "Obligation" RENAME COLUMN "title" TO "name";
