import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1662544340232 implements MigrationInterface {
  name = 'migrations1662544340232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "description"`);
  }
}
