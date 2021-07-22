import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

export default {
	metadataProvider: TsMorphMetadataProvider,
	entities: ['./dist/entities/**/*.js'],
	entitiesTs: ['./src/entities/**/*.ts'],
	dbName: 'faucet-db',
	type: 'sqlite'
}
