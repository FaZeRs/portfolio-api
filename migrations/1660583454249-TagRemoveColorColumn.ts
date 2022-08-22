import {MigrationInterface, QueryRunner} from "typeorm";

export class TagRemoveColorColumn1660583454249 implements MigrationInterface {
    name = 'TagRemoveColorColumn1660583454249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tags\` DROP COLUMN \`color\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tags\` ADD \`color\` varchar(255) NULL`);
    }

}
