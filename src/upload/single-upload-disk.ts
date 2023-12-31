import { Request } from "express";
import { uniqueId } from "lodash";
import multer from "multer";

const upload = (
  folder = "defaultFolder",
  imagePrefix: string
): multer.Multer => {
  const multerStorage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb) {
      cb(null, `${__dirname}/../../public/${folder}`);
    },
    filename: function (req: Request, file: Express.Multer.File, cb) {
      const ext = file.mimetype.split("/")[1];
      const filename = `${imagePrefix}-${uniqueId()}-${Date.now()}.${ext}`;
      req.body.image = filename;
      req.body.images = [];
      cb(null, filename);
    },
  });

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

  return multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1024 * 1024 * 5, files: 1 },
  });
};

export const uploadPostImageDisk = (folder: string, imagePrefix: string) => {
  return upload(folder, imagePrefix).single("image");
};
