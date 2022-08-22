import {MigrationInterface, QueryRunner} from "typeorm";

export class TagUpdate1657320593858 implements MigrationInterface {
    name = 'TagUpdate1657320593858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`projects_tags_tags\` (\`projectsId\` varchar(36) NOT NULL, \`tagsId\` varchar(36) NOT NULL, INDEX \`IDX_0e16f99420fe5a6ae7022afa8b\` (\`projectsId\`), INDEX \`IDX_3e919187cc1d287f881fc4f6e4\` (\`tagsId\`), PRIMARY KEY (\`projectsId\`, \`tagsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`projects_tags_tags\` ADD CONSTRAINT \`FK_0e16f99420fe5a6ae7022afa8b8\` FOREIGN KEY (\`projectsId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`projects_tags_tags\` ADD CONSTRAINT \`FK_3e919187cc1d287f881fc4f6e4e\` FOREIGN KEY (\`tagsId\`) REFERENCES \`tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`projects_tags_tags\` DROP FOREIGN KEY \`FK_3e919187cc1d287f881fc4f6e4e\``);
        await queryRunner.query(`ALTER TABLE \`projects_tags_tags\` DROP FOREIGN KEY \`FK_0e16f99420fe5a6ae7022afa8b8\``);
        await queryRunner.query(`DROP INDEX \`IDX_3e919187cc1d287f881fc4f6e4\` ON \`projects_tags_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_0e16f99420fe5a6ae7022afa8b\` ON \`projects_tags_tags\``);
        await queryRunner.query(`DROP TABLE \`projects_tags_tags\``);
    }

}
