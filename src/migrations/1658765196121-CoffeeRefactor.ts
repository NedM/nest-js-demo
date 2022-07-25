import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRefactor1658765196121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffees" RENAME COLUMN "provenance" TO "location"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffees" RENAME COLUMN "location" TO "provenance"`,
    );
  }
}
