-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "status" "public"."AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED';
