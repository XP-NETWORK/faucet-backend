import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Hash } from "@polkadot/types/interfaces";

@Entity()
export class TransactionInfo {
    @Property()
    address!: string;

    @Property()
    value!: string;

    @Property()
    tx!: string;

    @Property()
    timestamp!: number;

    constructor(address: string, value: string, tx: Hash) {
        this.address = address;
        this.value = value;
        this.tx = tx.toString();
        this.timestamp = Date.now();
    }
}