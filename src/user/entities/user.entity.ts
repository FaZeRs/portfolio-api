import {
  Column,
  CreateDateColumn,
  Entity,
  Unique,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  password: string;

  @Unique('username', ['username'])
  @Column({ length: 200 })
  username: string;

  @Column('simple-array')
  roles: string[];

  @Column()
  isAccountDisabled: boolean;

  @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
