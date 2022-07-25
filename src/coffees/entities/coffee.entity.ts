import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity('coffees') // SQL table name === 'coffees' (default would be 'coffee')
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @JoinTable()
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees, {
    cascade: true, // Could do just insert or update by specifying "['insert']"
  })
  flavors: Flavor[];

  @Column({ nullable: true })
  roast: string;

  @Column({ nullable: true })
  provenance: string;

  @Column({ default: 0 })
  recommendations: number;
}
