import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigration1678029367686 implements MigrationInterface {
    name = 'BaseMigration1678029367686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "url" character varying NOT NULL, "icon" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "projectId" uuid, CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('unknown', 'open', 'scheduled', 'inDevelopment', 'canceled', 'completed')`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "shortDescription" character varying, "description" character varying, "status" "public"."projects_status_enum" NOT NULL DEFAULT 'unknown', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "encoding" character varying, "mimeType" character varying, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" uuid, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experiences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "organisation" character varying, "description" character varying, "website" character varying, "dateFrom" TIMESTAMP NOT NULL, "dateTo" TIMESTAMP, "onGoing" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "logoId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "REL_7373c4339f79a16fc594ee4830" UNIQUE ("logoId"), CONSTRAINT "PK_884f0913a63882712ea578e7c85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "password" character varying NOT NULL, "username" character varying(200) NOT NULL, "roles" text NOT NULL, "isAccountDisabled" boolean NOT NULL, "email" character varying(200) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "username" UNIQUE ("username"), CONSTRAINT "email" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects_tags_tags" ("projectsId" uuid NOT NULL, "tagsId" uuid NOT NULL, CONSTRAINT "PK_56ad03b529f7cefa36d8885c45a" PRIMARY KEY ("projectsId", "tagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0e16f99420fe5a6ae7022afa8b" ON "projects_tags_tags" ("projectsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3e919187cc1d287f881fc4f6e4" ON "projects_tags_tags" ("tagsId") `);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "FK_75f8a32ad6839de37c249390568" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_15a7c8a5a676b9a0e0acd8209a5" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experiences" ADD CONSTRAINT "FK_7373c4339f79a16fc594ee48305" FOREIGN KEY ("logoId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects_tags_tags" ADD CONSTRAINT "FK_0e16f99420fe5a6ae7022afa8b8" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_tags_tags" ADD CONSTRAINT "FK_3e919187cc1d287f881fc4f6e4e" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects_tags_tags" DROP CONSTRAINT "FK_3e919187cc1d287f881fc4f6e4e"`);
        await queryRunner.query(`ALTER TABLE "projects_tags_tags" DROP CONSTRAINT "FK_0e16f99420fe5a6ae7022afa8b8"`);
        await queryRunner.query(`ALTER TABLE "experiences" DROP CONSTRAINT "FK_7373c4339f79a16fc594ee48305"`);
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_15a7c8a5a676b9a0e0acd8209a5"`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "FK_75f8a32ad6839de37c249390568"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3e919187cc1d287f881fc4f6e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0e16f99420fe5a6ae7022afa8b"`);
        await queryRunner.query(`DROP TABLE "projects_tags_tags"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "experiences"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "links"`);
    }

}
