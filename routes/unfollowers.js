import { Router } from 'express';
import { processUnfollowers } from '../services/following';

const router = Router();
router.get('/', async (req, res) => {
    return await processUnfollowers(req, res);
});

export default router;


