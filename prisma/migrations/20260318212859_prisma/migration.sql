/*
  Warnings:

  - You are about to drop the column `rol` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `rolId` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "rol",
ADD COLUMN     "rolId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_rol_key" ON "roles"("rol");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
