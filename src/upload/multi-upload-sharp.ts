import { NextFunction, Request, Response } from "express";
import { uniqueId } from "lodash";
import multer, { FileFilterCallback } from "multer";
import sharp from "sharp";

const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image")) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
  }
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadPostImages = (maxImages: number = 5) =>
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: maxImages },
  ]);

export const resizePostImages =
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
      if (!req.files) return next();

      // resize imageCover
      // @ts-ignore
      if (req.files?.image) {
        const fileName = `${imagePrefix}-${uniqueId()}-${Date.now()}.${imageFormat}`;
        await sharp(req.file?.buffer)
          .resize(imageWidth, imageHeight, {
            fit: imageFit,
          })
          .toFormat(imageFormat)
          .jpeg({ quality: imageQuality })
          .toFile(`${__dirname}/../../public/${folder}/single/${fileName}`);

        req.body.image = fileName;
      }

      // resize images
      // @ts-ignore
      if (req.files.images) {
        req.body.images = [];
        await Promise.all(
          // @ts-ignore
          req?.files?.images.map((file, i) => {
            const fileName = `${imagePrefix}-${uniqueId()}-${Date.now()}.${imageFormat}`;

            req.body.images.push(fileName);

            return sharp(file.buffer)
              .resize(imageWidth, imageHeight, {
                fit: imageFit,
              })
              .toFormat(imageFormat)
              .jpeg({ quality: imageQuality })
              .toFile(
                `${__dirname}/../../public/${folder}/multiple/${fileName}`
              );
          })
        );
      }

      next();
    } catch (err: any) {
      next(err);
    }
  };
