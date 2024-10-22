/*
  Warnings:

  - A unique constraint covering the columns `[email,photographer_id]` on the table `client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `photographer_id` to the `client` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ui_client_001";

-- AlterTable
ALTER TABLE "client" ADD COLUMN     "photographer_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ui_client_001" ON "client"("email", "photographer_id");

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_photographer_id_fkey" FOREIGN KEY ("photographer_id") REFERENCES "photographer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
