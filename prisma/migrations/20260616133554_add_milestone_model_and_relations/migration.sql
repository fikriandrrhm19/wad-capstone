-- CreateEnum
CREATE TYPE "public"."MilestoneStatus" AS ENUM ('PENDING', 'ACHIEVED');

-- AlterTable
ALTER TABLE "public"."tasks" ADD COLUMN     "milestoneId" INTEGER;

-- CreateTable
CREATE TABLE "public"."milestones" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."MilestoneStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "milestones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "milestones_userId_idx" ON "public"."milestones"("userId");

-- CreateIndex
CREATE INDEX "milestones_status_idx" ON "public"."milestones"("status");

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "public"."milestones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."milestones" ADD CONSTRAINT "milestones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
