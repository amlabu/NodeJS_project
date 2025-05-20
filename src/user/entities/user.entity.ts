import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  fullName: string;

  @Column()
  firstName: string;

  @Column()
  accountStatus: boolean;

  @Column()
  lastName: string;

  @Column()
  dateJoined: Date;

  @Column()
  pageNo: number;

  @Column({default: false})
  isApproved: boolean;
}
