import {MigrationInterface, QueryRunner} from "typeorm";

export class ProjectFiles1657135267268 implements MigrationInterface {
    name = 'ProjectFiles1657135267268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`projects_images_files\` (\`projectsId\` varchar(36) NOT NULL, \`filesId\` varchar(36) NOT NULL, INDEX \`IDX_6ece1e2db894f82fddc02351d7\` (\`projectsId\`), INDEX \`IDX_2f8cc6565bed14f77ba5a5fd16\` (\`filesId\`), PRIMARY KEY (\`projectsId\`, \`filesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`projects_images_files\` ADD CONSTRAINT \`FK_6ece1e2db894f82fddc02351d76\` FOREIGN KEY (\`projectsId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`projects_images_files\` ADD CONSTRAINT \`FK_2f8cc6565bed14f77ba5a5fd16e\` FOREIGN KEY (\`filesId\`) REFERENCES \`files\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`projects_images_files\` DROP FOREIGN KEY \`FK_2f8cc6565bed14f77ba5a5fd16e\``);
        await queryRunner.query(`ALTER TABLE \`projects_images_files\` DROP FOREIGN KEY \`FK_6ece1e2db894f82fddc02351d76\``);
        await queryRunner.query(`DROP INDEX \`IDX_2f8cc6565bed14f77ba5a5fd16\` ON \`projects_images_files\``);
        await queryRunner.query(`DROP INDEX \`IDX_6ece1e2db894f82fddc02351d7\` ON \`projects_images_files\``);
        await queryRunner.query(`DROP TABLE \`projects_images_files\``);
    }

}
