import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BikeTitle {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column('varchar')
    title: string | undefined;

    @Column('varchar', { nullable: true })
    subtitle: string | undefined;

    @Column('int')
    bikeId: number | undefined;

    public toString = (): string =>
        JSON.stringify({
            id: this.id,
            title: this.title,
            subtitle: this.subtitle,
            bikeId: this.bikeId,
        });
}