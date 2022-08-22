import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  JoinTable,
} from 'typeorm';

import { Link } from '../../link/entities/link.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { File } from '../../file/entities/file.entity';

export enum ProjectStatus {
  UNKNOWN = 'unknown',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  IN_DEVELOPMENT = 'inDevelopment',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  shortDescription: string;

  @Column({ nullable: true, type: 'longtext' })
  description: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.UNKNOWN,
  })
  status: ProjectStatus;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Link, (link) => link.project, {
    eager: true,
  })
  links: Link[];

  @ManyToMany(() => Tag, (tag) => tag.projects, {
    eager: true,
  })
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => File, (file) => file.project, {
    eager: true,
  })
  @JoinTable()
  images: File[];
}
