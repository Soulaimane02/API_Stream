import Express from 'express';
import Path from 'path';

const router = Express.Router();

router.use('/profile_pictures', Express.static(Path.join(__dirname, '../uploads/profile_pictures')));
router.use('/img_movie', Express.static(Path.join(__dirname, '../uploads/img_movie')));
router.use('/video_movie', Express.static(Path.join(__dirname, '../uploads/video_movie')));
router.use('/img_series', Express.static(Path.join(__dirname, '../uploads/img_series')));
router.use('/video_serie_episode', Express.static(Path.join(__dirname, '../uploads/video_serie_episode')));

export default router;