-- DropForeignKey
ALTER TABLE "findings" DROP CONSTRAINT "findings_assessmentId_fkey";

-- DropForeignKey
ALTER TABLE "findings" DROP CONSTRAINT "findings_endpointId_fkey";

-- DropTable
DROP TABLE "findings";

-- DropEnum
DROP TYPE "FindingStatus";

