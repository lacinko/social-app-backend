import { NextFunction, Request, Response } from "express";
import { uniqueId } from "lodash";
import multer from "multer";
import sharp from "sharp";

const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image")) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
  }

  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

export const uploadPostImage = upload.single("image");

export const resizePostImage =
  (
    folder: string,
    imagePrefix: string,
    imageFormat: keyof sharp.FormatEnum,
    imageQuality: number,
    imageHeight: number,
    imageWidth: number,
    imageFit?: keyof sharp.FitEnum | undefined
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      if (!file) return next();

      const fileName = `${imagePrefix}-${uniqueId()}-${Date.now()}.${imageFormat}`;
      await sharp(req.file?.buffer)
        .resize(imageWidth, imageHeight, {
          fit: imageFit,
        })
        .toFormat(imageFormat)
        .jpeg({ quality: imageQuality })
        .toFile(`${__dirname}/../../public/${folder}/${fileName}`);

      req.body.image = fileName;

      next();
    } catch (err: any) {
      next(err);
    }
  };
