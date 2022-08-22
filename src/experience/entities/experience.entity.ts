import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { File } from '../../file/entities/file.entity';

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  organisation: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column()
  dateFrom: Date;

  @Column({ nullable: true })
  dateTo: Date;

  @Column({ default: false })
  onGoing: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  logoId?: string;

  @JoinColumn({ name: 'logoId' })
  @OneToOne(() => File, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  logo?: File;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
