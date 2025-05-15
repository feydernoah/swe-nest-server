import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BikeImage {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column('varchar')
    description: string | undefined;

    @Column('varchar')
    contentType: string | undefined;

    @Column('int')
    bikeId: number | undefined;

    @Column('bytea', { name: 'image', nullable: true })
    data: Buffer | undefined;

    public toString = (): string =>
        JSON.stringify({
            id: this.id,
            description: this.description,
            contentType: this.contentType,
            bikeId: this.bikeId,
        });
}