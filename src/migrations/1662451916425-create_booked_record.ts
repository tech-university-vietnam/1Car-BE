import { MigrationInterface, QueryRunner } from 'typeorm';

export class newMigration1662451916425 implements MigrationInterface {
  name = 'newMigration1662451916425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_a9134ff4801edd43442f58eef04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_150041369366ed7fdd8b3f02194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_2f3907d404ced8660b5a227c96b"`,
    );
    await queryRunner.query(
      `CREATE TABLE "car_attribute" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" text NOT NULL, "value" text NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d8e13dea7e26e44370d7fe757ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "booked_record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "bookedDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3f28496146f3cd2c274396975ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "car_attributes_car_attribute" ("carId" uuid NOT NULL, "carAttributeId" uuid NOT NULL, CONSTRAINT "PK_47913ec47936bde92e40303a1ac" PRIMARY KEY ("carId", "carAttributeId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7e2c1665a4232132c86984db40" ON "car_attributes_car_attribute" ("carId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_80b18d5b23ecbb9e3e72466efb" ON "car_attributes_car_attribute" ("carAttributeId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "booked_record_booked_cars_car" ("bookedRecordId" uuid NOT NULL, "carId" uuid NOT NULL, CONSTRAINT "PK_8c006d9eb09fc1621cc0cdb84d1" PRIMARY KEY ("bookedRecordId", "carId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f6266dcfdede1e90032a79af53" ON "booked_record_booked_cars_car" ("bookedRecordId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_91f7b20f326626dcf0c0c34453" ON "booked_record_booked_cars_car" ("carId") `,
    );
    await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "carTypeId"`);
    await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "carBrandId"`);
    await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "carSizeId"`);
    await queryRunner.query(
      `ALTER TABLE "car_attributes_car_attribute" ADD CONSTRAINT "FK_7e2c1665a4232132c86984db40c" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_attributes_car_attribute" ADD CONSTRAINT "FK_80b18d5b23ecbb9e3e72466efbb" FOREIGN KEY ("carAttributeId") REFERENCES "car_attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "booked_record_booked_cars_car" ADD CONSTRAINT "FK_f6266dcfdede1e90032a79af53c" FOREIGN KEY ("bookedRecordId") REFERENCES "booked_record"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "booked_record_booked_cars_car" ADD CONSTRAINT "FK_91f7b20f326626dcf0c0c344534" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booked_record_booked_cars_car" DROP CONSTRAINT "FK_91f7b20f326626dcf0c0c344534"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booked_record_booked_cars_car" DROP CONSTRAINT "FK_f6266dcfdede1e90032a79af53c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_attributes_car_attribute" DROP CONSTRAINT "FK_80b18d5b23ecbb9e3e72466efbb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_attributes_car_attribute" DROP CONSTRAINT "FK_7e2c1665a4232132c86984db40c"`,
    );
    await queryRunner.query(`ALTER TABLE "car" ADD "carSizeId" uuid`);
    await queryRunner.query(`ALTER TABLE "car" ADD "carBrandId" uuid`);
    await queryRunner.query(`ALTER TABLE "car" ADD "carTypeId" uuid`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_91f7b20f326626dcf0c0c34453"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f6266dcfdede1e90032a79af53"`,
    );
    await queryRunner.query(`DROP TABLE "booked_record_booked_cars_car"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_80b18d5b23ecbb9e3e72466efb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7e2c1665a4232132c86984db40"`,
    );
    await queryRunner.query(`DROP TABLE "car_attributes_car_attribute"`);
    await queryRunner.query(`DROP TABLE "booked_record"`);
    await queryRunner.query(`DROP TABLE "car_attribute"`);
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_2f3907d404ced8660b5a227c96b" FOREIGN KEY ("carSizeId") REFERENCES "car_size"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_150041369366ed7fdd8b3f02194" FOREIGN KEY ("carBrandId") REFERENCES "car_brand"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_a9134ff4801edd43442f58eef04" FOREIGN KEY ("carTypeId") REFERENCES "car_type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
