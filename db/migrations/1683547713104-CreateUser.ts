import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1683547713104 implements MigrationInterface {
    name = 'CreateUser1683547713104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_finances" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "value" integer NOT NULL, "type_finance" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "categoryId" integer, "userId" integer, CONSTRAINT "FK_626828885f488b207223d1e07ee" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_finances"("id", "name", "value", "type_finance", "created_at", "updated_at", "categoryId") SELECT "id", "name", "value", "type_finance", "created_at", "updated_at", "categoryId" FROM "finances"`);
        await queryRunner.query(`DROP TABLE "finances"`);
        await queryRunner.query(`ALTER TABLE "temporary_finances" RENAME TO "finances"`);
        await queryRunner.query(`CREATE TABLE "temporary_finances" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "value" integer NOT NULL, "type_finance" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "categoryId" integer, "userId" integer, CONSTRAINT "FK_626828885f488b207223d1e07ee" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_29d58d04e6b88654ede43247667" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_finances"("id", "name", "value", "type_finance", "created_at", "updated_at", "categoryId", "userId") SELECT "id", "name", "value", "type_finance", "created_at", "updated_at", "categoryId", "userId" FROM "finances"`);
        await queryRunner.query(`DROP TABLE "finances"`);
        await queryRunner.query(`ALTER TABLE "temporary_finances" RENAME TO "finances"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finances" RENAME TO "temporary_finances"`);
        await queryRunner.query(`CREATE TABLE "finances" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "value" integer NOT NULL, "type_finance" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "categoryId" integer, "userId" integer, CONSTRAINT "FK_626828885f488b207223d1e07ee" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "finances"("id", "name", "value", "type_finance", "created_at", "updated_at", "categoryId", "userId") SELECT "id", "name", "value", "type_finance", "created_at", "updated_at", "categoryId", "userId" FROM "temporary_finances"`);
        await queryRunner.query(`DROP TABLE "temporary_finances"`);
        await queryRunner.query(`ALTER TABLE "finances" RENAME TO "temporary_finances"`);
        await queryRunner.query(`CREATE TABLE "finances" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "value" integer NOT NULL, "type_finance" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "categoryId" integer, CONSTRAINT "FK_626828885f488b207223d1e07ee" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "finances"("id", "name", "value", "type_finance", "created_at", "updated_at", "categoryId") SELECT "id", "name", "value", "type_finance", "created_at", "updated_at", "categoryId" FROM "temporary_finances"`);
        await queryRunner.query(`DROP TABLE "temporary_finances"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
