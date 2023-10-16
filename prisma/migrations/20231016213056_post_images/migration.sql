/*
  Warnings:

  - You are about to drop the column `image` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "postimages" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "postimages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "postimages" ADD CONSTRAINT "postimages_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
