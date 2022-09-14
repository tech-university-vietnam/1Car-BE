import { MigrationInterface, QueryRunner } from "typeorm";

export class fullSchemeInit1663123521209 implements MigrationInterface {
    name = 'fullSchemeInit1663123521209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "car_attribute_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cc2ca256e02e6d4fb3664ba311c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" text NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "typeId" uuid, CONSTRAINT "PK_d8e13dea7e26e44370d7fe757ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text, "status" text NOT NULL DEFAULT 'AVAILABLE', "pricePerDate" double precision NOT NULL, "numberOfTrips" integer NOT NULL DEFAULT '0', "numberOfKilometer" double precision NOT NULL DEFAULT '0', "images" text array DEFAULT '{}', "locationId" text, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booked_record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookTime" tstzrange NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "carId" uuid, CONSTRAINT "PK_3f28496146f3cd2c274396975ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."booking_bookingstatus_enum" AS ENUM('PENDING', 'SUCCESS', 'FAIL')`);
        await queryRunner.query(`CREATE TYPE "public"."booking_pickupstatus_enum" AS ENUM('PENDING', 'PICKUP', 'RETURNED')`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "carId" uuid NOT NULL, "receivedDateTime" TIMESTAMP, "returnDateTime" TIMESTAMP NOT NULL, "pickUpLocationId" character varying NOT NULL, "totalPrice" integer NOT NULL, "description" character varying, "discountCode" character varying, "transactionId" character varying, "bookingStatus" "public"."booking_bookingstatus_enum" NOT NULL DEFAULT 'PENDING', "pickUpStatus" "public"."booking_pickupstatus_enum" NOT NULL DEFAULT 'PENDING', "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "bookingId" uuid NOT NULL, "stripePaymentId" character varying NOT NULL, "amount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_5738278c92c15e1ec9d27e3a09" UNIQUE ("bookingId"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_userrole_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "email" character varying(120) NOT NULL, "userRole" "public"."user_userrole_enum" NOT NULL DEFAULT 'USER', "phoneNumber" character varying(120), "dateOfBirth" character varying(120), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_attributes_car_attribute" ("carId" uuid NOT NULL, "carAttributeId" uuid NOT NULL, CONSTRAINT "PK_47913ec47936bde92e40303a1ac" PRIMARY KEY ("carId", "carAttributeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7e2c1665a4232132c86984db40" ON "car_attributes_car_attribute" ("carId") `);
        await queryRunner.query(`CREATE INDEX "IDX_80b18d5b23ecbb9e3e72466efb" ON "car_attributes_car_attribute" ("carAttributeId") `);
        await queryRunner.query(`ALTER TABLE "car_attribute" ADD CONSTRAINT "FK_44e94d3c6b1c7839efdd3eb42be" FOREIGN KEY ("typeId") REFERENCES "car_attribute_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booked_record" ADD CONSTRAINT "FK_bd88a1240c8abf7c8ff40eeff51" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_5738278c92c15e1ec9d27e3a098" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_attributes_car_attribute" ADD CONSTRAINT "FK_7e2c1665a4232132c86984db40c" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "car_attributes_car_attribute" ADD CONSTRAINT "FK_80b18d5b23ecbb9e3e72466efbb" FOREIGN KEY ("carAttributeId") REFERENCES "car_attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_attributes_car_attribute" DROP CONSTRAINT "FK_80b18d5b23ecbb9e3e72466efbb"`);
        await queryRunner.query(`ALTER TABLE "car_attributes_car_attribute" DROP CONSTRAINT "FK_7e2c1665a4232132c86984db40c"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_5738278c92c15e1ec9d27e3a098"`);
        await queryRunner.query(`ALTER TABLE "booked_record" DROP CONSTRAINT "FK_bd88a1240c8abf7c8ff40eeff51"`);
        await queryRunner.query(`ALTER TABLE "car_attribute" DROP CONSTRAINT "FK_44e94d3c6b1c7839efdd3eb42be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_80b18d5b23ecbb9e3e72466efb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e2c1665a4232132c86984db40"`);
        await queryRunner.query(`DROP TABLE "car_attributes_car_attribute"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_userrole_enum"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TYPE "public"."booking_pickupstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."booking_bookingstatus_enum"`);
        await queryRunner.query(`DROP TABLE "booked_record"`);
        await queryRunner.query(`DROP TABLE "car"`);
        await queryRunner.query(`DROP TABLE "car_attribute"`);
        await queryRunner.query(`DROP TABLE "car_attribute_type"`);
    }

}
