import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1662203373694 implements MigrationInterface {
  name = 'migrations1662203373694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "car_brand" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cbaa76a620e6e21773085a96bf1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "car_size" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d4e433258bef306b3938a14d9d8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "car_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7bfbb82e6b89e82079a62290ff6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "car" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text, "status" text NOT NULL DEFAULT 'AVAILABLE', "pricePerDate" double precision NOT NULL, "numberOfTrips" integer NOT NULL DEFAULT '0', "numberOfKilometer" double precision NOT NULL DEFAULT '0', "images" text array DEFAULT '{}', "locationId" text, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "carTypeId" uuid, "carBrandId" uuid, "carSizeId" uuid, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."booking_bookingstatus_enum" AS ENUM('PENDING', 'SUCCESS', 'FAIL')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."booking_pickupstatus_enum" AS ENUM('PENDING', 'PICKUP', 'RETURNED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "carId" uuid NOT NULL, "receivedDateTime" TIMESTAMP, "returnDateTime" TIMESTAMP NOT NULL, "pickUpLocationId" character varying NOT NULL, "totalPrice" integer NOT NULL, "discountCode" character varying, "transactionId" character varying, "bookingStatus" "public"."booking_bookingstatus_enum" NOT NULL DEFAULT 'PENDING', "pickUpStatus" "public"."booking_pickupstatus_enum" NOT NULL DEFAULT 'PICKUP', "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "bookingId" uuid NOT NULL, "stripePaymentId" character varying NOT NULL, "amount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_5738278c92c15e1ec9d27e3a09" UNIQUE ("bookingId"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_userrole_enum" AS ENUM('USER', 'ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "email" character varying(120) NOT NULL, "userRole" "public"."user_userrole_enum" NOT NULL DEFAULT 'USER', "phoneNumber" character varying(120), "dateOfBirth" character varying(120), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_a9134ff4801edd43442f58eef04" FOREIGN KEY ("carTypeId") REFERENCES "car_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_150041369366ed7fdd8b3f02194" FOREIGN KEY ("carBrandId") REFERENCES "car_brand"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_2f3907d404ced8660b5a227c96b" FOREIGN KEY ("carSizeId") REFERENCES "car_size"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_5738278c92c15e1ec9d27e3a098" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_5738278c92c15e1ec9d27e3a098"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_2f3907d404ced8660b5a227c96b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_150041369366ed7fdd8b3f02194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_a9134ff4801edd43442f58eef04"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_userrole_enum"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TABLE "booking"`);
    await queryRunner.query(`DROP TYPE "public"."booking_pickupstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."booking_bookingstatus_enum"`);
    await queryRunner.query(`DROP TABLE "car"`);
    await queryRunner.query(`DROP TABLE "car_type"`);
    await queryRunner.query(`DROP TABLE "car_size"`);
    await queryRunner.query(`DROP TABLE "car_brand"`);
  }
}
