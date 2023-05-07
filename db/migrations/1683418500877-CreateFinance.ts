import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFinance1683418500877 implements MigrationInterface {
    name = 'CreateFinance1683418500877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "finances" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "value" integer NOT NULL, "type_finance" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "categoryId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_finances" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "value" integer NOT NULL, "type_finance" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "categoryId" integer, CONSTRAINT "FK_626828885f488b207223d1e07ee" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_finances"("id", "name", "value", "type_finance", "created_at", "updated_at", "categoryId") SELECT "id", "name", "value", "type_finance", "created_at", "updated_at", "categoryId" FROM "finances"`);
        await queryRunner.query(`DROP TABLE "finances"`);
        await queryRunner.query(`ALTER TABLE "temporary_finances" RENAME TO "finances"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finances" RENAME TO "temporary_finances"`);
        await queryRunner.query(`CREATE TABLE "finances" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "value" integer NOT NULL, "type_finance" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "categoryId" integer)`);
        await queryRunner.query(`INSERT INTO "finances"("id", "name", "value", "type_finance", "created_at", "updated_at", "categoryId") SELECT "id", "name", "value", "type_finance", "created_at", "updated_at", "categoryId" FROM "temporary_finances"`);
        await queryRunner.query(`DROP TABLE "temporary_finances"`);
        await queryRunner.query(`DROP TABLE "finances"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
