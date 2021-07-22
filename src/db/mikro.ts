import { MikroORM } from "@mikro-orm/core";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

export const orm = await MikroORM.init({
    metadataProvider: TsMorphMetadataProvider,
    entities: ['./dist/entities/**/*.js'],
    entitiesTs: ['./src/entities/**/*.ts'],
    dbName: 'faucet-db',
    type: 'sqlite'
})