import Multer from "multer";
import Path from "path";
import { Request } from "express";

const storageConfig = Multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, Path.join(__dirname, "../../uploads/profile_pictures"));
  },
  filename: (req: Request, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = Multer({ storage: storageConfig }).single("profile_picture");
export const uploadProfilPicture = Multer({ storage: storageConfig }).single("profile_picture");


const movieImageStorage = Multer.diskStorage({
  destination: (req: Request, file, cb) => {
    if (file.fieldname === 'img') {
      cb(null, Path.join(__dirname, "../../uploads/img_movie"));
    } else if (file.fieldname === 'video') {
      cb(null, Path.join(__dirname, "../../uploads/video_movie"));
    }
  },
  filename: (req: Request, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export const uploadMovie = Multer({ storage: movieImageStorage }).fields([
  { name: 'img', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);


const serieImageStorage = Multer.diskStorage({
  destination: (req: Request, file, cb) => {
    if (file.fieldname === 'img') {
      cb(null, Path.join(__dirname, "../../uploads/img_series"));
    }},
  filename: (req: Request, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export const uploadSerieImg = Multer({ storage: serieImageStorage }).fields([{ name: 'img', maxCount: 1 }]);


const videoEpisodeStorage = Multer.diskStorage({
  destination: (req: Request, file, cb) => {
      if (file.fieldname === 'video') {
          cb(null, Path.join(__dirname, "../../uploads/video_serie_episode")); 
      }
  },
  filename: (req: Request, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
  }
});

export const uploadEpisodeVideo = Multer({ storage: videoEpisodeStorage }).fields([
  { name: 'video', maxCount: 1 }
]);

export default upload;