import { Router } from 'express';
import postRouter from '../routes/index'; // ✅ if you want direct controller functions
// OR


const router = Router();

router.use('/api/posts', postRouter);

export default router;
