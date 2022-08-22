import {MigrationInterface, QueryRunner} from "typeorm";

export class ProjectFilesUpdate1657319470108 implements MigrationInterface {
    name = 'ProjectFilesUpdate1657319470108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`files\` ADD \`projectId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`files\` ADD CONSTRAINT \`FK_15a7c8a5a676b9a0e0acd8209a5\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_15a7c8a5a676b9a0e0acd8209a5\``);
        await queryRunner.query(`ALTER TABLE \`files\` DROP COLUMN \`projectId\``);
    }

}
