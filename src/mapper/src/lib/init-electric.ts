import { electrify } from 'electric-sql/pglite';
import { PGlite } from '@electric-sql/pglite';
import { type Electric, schema } from '$lib/migrations';

const config = {
	url: 'http://localhost:5133',
};

export const initElectric = async (): Promise<Electric> => {
	const conn = new PGlite('idb://fmtm.db', {
		relaxedDurability: true,
	});
	const electric = await electrify(conn, schema, config);
	await electric.connect('eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0');
	return electric;
};
