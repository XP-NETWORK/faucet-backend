import { GenericMultiAddress } from '@polkadot/types';
import cors from 'cors';
import express, { NextFunction, Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import ormConf from "./mikro-orm.config";
import { HttpError } from './errors/http';
import * as Polkadot from './helpers/polkadot'
import { requestDbCtx } from './middlewares/db'
import errorMiddleware from './middlewares/error';
import * as config from './config/config.json';
import { TransactionInfo } from './entities/transactions';

const main = async () => {
	const app = express()
	const polka = await Polkadot.newHelper(config.node, config.faucet_seed);
	const min_ms = config.min_hrs * 36e6;

	//@ts-expect-error: mikro orm sqlite
	const orm = await MikroORM.init(ormConf);

	app.use(cors());
	app.use(express.json())
	app.use((req, res, next) => requestDbCtx(orm, req, res, next));

	app.get('/balance', async (_req: Request, res: Response, next: NextFunction) => {
		try {
			res.json({ balance: (await Polkadot.balanceOf(polka, polka.faucet.address)).toString() });
		} catch (e) {
			return next(new HttpError(500, e.message));
		}
	});

	app.post('/transfer', async (req: Request<{}, {}, FaucetWithdrawReq>, res: Response, next: NextFunction) => {
		let amount: BigInt;
		let address: GenericMultiAddress;
		let err: Error | undefined;
		try {
			amount = BigInt(req.body.amount);
			if (amount > BigInt(config.max)) {
				throw Error()
			}
		} catch (_) {
			return next(new HttpError(400, "invalid amount"));
		};
		try {
			address = new GenericMultiAddress(polka.api.registry, req.body.target);
		} catch (_) {
			return next(new HttpError(400, "invalid address"));
		}

		const txrepo = orm.em.getRepository(TransactionInfo);
		const last = (await txrepo.findOne({ address: req.body.target }))?.timestamp;
		const diff = last ? Date.now() - last : Infinity;
		if (diff < min_ms) {
			return next(new HttpError(429, `please retry after ${min_ms - diff}ms`))
		}

		const tx = await Polkadot.transfer(polka, address, amount).catch(e => err = e);
		if (err) {
			return next(err);
		}

		txrepo.persistAndFlush([new TransactionInfo(req.body.target, req.body.amount, tx)]);

		res.json({ hash: tx.toString() });
	});

	app.get('/history/:n', async (req: Request, res: Response, next: NextFunction) => {
		let limit: number;
		try {
			limit = parseInt(req.params.n);
		} catch (_) {
			return next(new HttpError(400, "invalid limit"))
		}

		const txs = await orm.em.find(TransactionInfo, {}, {
			orderBy: { timestamp: 'ASC' },
			limit
		})

		res.json(txs);
	});

	app.use(errorMiddleware);
	app.listen(config.port, () => console.log(`Express Server is up @ ${config.port}`))
}

main()
