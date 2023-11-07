-- DropForeignKey
ALTER TABLE "postimages" DROP CONSTRAINT "postimages_postId_fkey";

-- AddForeignKey
ALTER TABLE "postimages" ADD CONSTRAINT "postimages_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
