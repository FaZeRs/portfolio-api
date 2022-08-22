import {MigrationInterface, QueryRunner} from "typeorm";

export class BaseMigration1656752635475 implements MigrationInterface {
    name = 'BaseMigration1656752635475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`files\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`encoding\` varchar(255) NULL, \`mimeType\` varchar(255) NULL, \`url\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`experiences\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`organisation\` varchar(255) NULL, \`description\` varchar(255) NULL, \`website\` varchar(255) NULL, \`dateFrom\` datetime NOT NULL, \`dateTo\` datetime NULL, \`onGoing\` tinyint NOT NULL DEFAULT 0, \`isActive\` tinyint NOT NULL DEFAULT 1, \`logoId\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`REL_7373c4339f79a16fc594ee4830\` (\`logoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tags\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`color\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`projects\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`shortDescription\` varchar(255) NULL, \`description\` varchar(255) NULL, \`status\` enum ('unknown', 'open', 'scheduled', 'inDevelopment', 'canceled', 'completed') NOT NULL DEFAULT 'unknown', \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`links\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`icon\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`projectId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`username\` varchar(200) NOT NULL, \`roles\` text NOT NULL, \`isAccountDisabled\` tinyint NOT NULL, \`email\` varchar(200) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`username\` (\`username\`), UNIQUE INDEX \`email\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tags_projects_projects\` (\`tagsId\` varchar(36) NOT NULL, \`projectsId\` varchar(36) NOT NULL, INDEX \`IDX_198afb1cdd5aa1444c2cfed60a\` (\`tagsId\`), INDEX \`IDX_a9ab91a7846974680673f87be7\` (\`projectsId\`), PRIMARY KEY (\`tagsId\`, \`projectsId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`experiences\` ADD CONSTRAINT \`FK_7373c4339f79a16fc594ee48305\` FOREIGN KEY (\`logoId\`) REFERENCES \`files\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`links\` ADD CONSTRAINT \`FK_75f8a32ad6839de37c249390568\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tags_projects_projects\` ADD CONSTRAINT \`FK_198afb1cdd5aa1444c2cfed60a4\` FOREIGN KEY (\`tagsId\`) REFERENCES \`tags\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tags_projects_projects\` ADD CONSTRAINT \`FK_a9ab91a7846974680673f87be7f\` FOREIGN KEY (\`projectsId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tags_projects_projects\` DROP FOREIGN KEY \`FK_a9ab91a7846974680673f87be7f\``);
        await queryRunner.query(`ALTER TABLE \`tags_projects_projects\` DROP FOREIGN KEY \`FK_198afb1cdd5aa1444c2cfed60a4\``);
        await queryRunner.query(`ALTER TABLE \`links\` DROP FOREIGN KEY \`FK_75f8a32ad6839de37c249390568\``);
        await queryRunner.query(`ALTER TABLE \`experiences\` DROP FOREIGN KEY \`FK_7373c4339f79a16fc594ee48305\``);
        await queryRunner.query(`DROP INDEX \`IDX_a9ab91a7846974680673f87be7\` ON \`tags_projects_projects\``);
        await queryRunner.query(`DROP INDEX \`IDX_198afb1cdd5aa1444c2cfed60a\` ON \`tags_projects_projects\``);
        await queryRunner.query(`DROP TABLE \`tags_projects_projects\``);
        await queryRunner.query(`DROP INDEX \`email\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`username\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`links\``);
        await queryRunner.query(`DROP TABLE \`projects\``);
        await queryRunner.query(`DROP TABLE \`tags\``);
        await queryRunner.query(`DROP INDEX \`REL_7373c4339f79a16fc594ee4830\` ON \`experiences\``);
        await queryRunner.query(`DROP TABLE \`experiences\``);
        await queryRunner.query(`DROP TABLE \`files\``);
    }

}
