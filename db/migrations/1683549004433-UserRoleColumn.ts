import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRoleColumn1683549004433 implements MigrationInterface {
    name = 'UserRoleColumn1683549004433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "role" integer NOT NULL DEFAULT (1), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "name", "email", "password", "created_at", "updated_at") SELECT "id", "name", "email", "password", "created_at", "updated_at" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "name", "email", "password", "created_at", "updated_at") SELECT "id", "name", "email", "password", "created_at", "updated_at" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
    }

}
