import { Router } from 'express';

import { invoiceRouter } from './invoice.route';

const indexRouter = Router();

indexRouter.use('/invoice', invoiceRouter);

export { indexRouter };
