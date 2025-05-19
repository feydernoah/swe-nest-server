import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { BikeTitle } from './bike-title.entity.js';

/**
 * Repräsentiert ein Fahrrad im System.
 * 
 * Diese Entity enthält grundlegende Informationen wie Marke, Typ, Rahmenhöhe,
 * Preis und Verfügbarkeit eines Fahrrads. Sie steht in einer 1:1-Beziehung zu
 * einem optionalen `BikeTitle`, das zusätzliche beschreibende Informationen enthalten kann.
 * 
 * Die ID wird automatisch generiert und dient als Primärschlüssel.
 */
@Entity()
export class Bike {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column('varchar')
    brand: string | undefined;

    @Column('varchar')
    type: string | undefined;

    @Column('varchar')
    frameSize: string | undefined;

    @Column('decimal')
    price: number | undefined;

    @Column('boolean')
    available: boolean | undefined;

    @OneToOne(() => BikeTitle)
    @JoinColumn({ name: 'id', referencedColumnName: 'bikeId' })
    title: BikeTitle | undefined;

    public toString = (): string =>
        JSON.stringify({
            id: this.id,
            brand: this.brand,
            type: this.type,
            frameSize: this.frameSize,
            price: this.price,
            available: this.available,
            title: this.title,
        });
}