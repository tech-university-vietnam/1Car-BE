import { MigrationInterface, QueryRunner } from 'typeorm';

export class newMigration1662520957284 implements MigrationInterface {
  name = 'newMigration1662520957284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car_attribute" RENAME COLUMN "type" TO "typeId"`,
    );
    await queryRunner.query(
      `CREATE TABLE "car_attribute_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cc2ca256e02e6d4fb3664ba311c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "booked_record" DROP COLUMN "bookedDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booked_record" ADD "bookTime" tstzrange NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "booked_record" ADD "carId" uuid`);
    await queryRunner.query(`ALTER TABLE "car_attribute" DROP COLUMN "typeId"`);
    await queryRunner.query(`ALTER TABLE "car_attribute" ADD "typeId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "car_attribute" ADD CONSTRAINT "FK_44e94d3c6b1c7839efdd3eb42be" FOREIGN KEY ("typeId") REFERENCES "car_attribute_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booked_record" ADD CONSTRAINT "FK_bd88a1240c8abf7c8ff40eeff51" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booked_record" DROP CONSTRAINT "FK_bd88a1240c8abf7c8ff40eeff51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_attribute" DROP CONSTRAINT "FK_44e94d3c6b1c7839efdd3eb42be"`,
    );
    await queryRunner.query(`ALTER TABLE "car_attribute" DROP COLUMN "typeId"`);
    await queryRunner.query(
      `ALTER TABLE "car_attribute" ADD "typeId" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "booked_record" DROP COLUMN "carId"`);
    await queryRunner.query(
      `ALTER TABLE "booked_record" DROP COLUMN "bookTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booked_record" ADD "bookedDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "car_attribute_type"`);
    await queryRunner.query(
      `ALTER TABLE "car_attribute" RENAME COLUMN "typeId" TO "type"`,
    );
  }
}
