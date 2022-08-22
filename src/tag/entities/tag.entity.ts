import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  UpdateDateColumn,
  JoinTable,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

import { Project } from '../../project/entities/project.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Project, (project) => project.tags, { nullable: true })
  projects: Project[];
}
