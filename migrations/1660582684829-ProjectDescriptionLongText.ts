import {MigrationInterface, QueryRunner} from "typeorm";

export class ProjectDescriptionLongText1660582684829 implements MigrationInterface {
    name = 'ProjectDescriptionLongText1660582684829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD \`description\` longtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD \`description\` varchar(255) NULL`);
    }

}
