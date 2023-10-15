import { PathLike } from "fs";
import fs from "fs/promises";
export type GenericObject = { [key: string]: boolean | string | object };

export const createObjectFromURLParamsAttributes = (url: GenericObject) => {
  const attributesObject = {} as GenericObject;

  Array.from(Object.entries(url)).map(([key, value]) => {
    if (value === "true" || value === "false") {
      attributesObject[key] = value === "true";
    } else {
      try {
        attributesObject[key] = JSON.parse(value as string);
      } catch (error) {
        attributesObject[key] = {};
      }
    }
  });

  return attributesObject;
};

export const selectRandomNumberFromSelectedRange = (range: number) => {
  return Math.floor(Math.random() * range - 1);
};

export const selectDefaultImagePathFromFolderImages = async (
  folder: string
) => {
  const folderPath = __dirname.split("src\\utils")[0] + folder;
  let images: Array<string | null> = [];
  try {
    const files = await fs.readdir(folderPath);

    const fileNames = await Promise.all(
      files.map(async (file) => {
        const stat = await fs.stat(`${folderPath}/${file}`);
        if (stat.isFile()) {
          return file;
        }
        return null;
      })
    );

    // Filter out null values (directories)
    images = [...fileNames.filter((file) => file !== null)];
  } catch (err) {
    console.error("Error reading folder:", err);
  }
  const randomIndex = selectRandomNumberFromSelectedRange(images.length - 1);
  return images[randomIndex];
};

export const deleteOldImageFromDisk = async (path: PathLike) => {
  const deleted = fs.unlink(path);
  return deleted === undefined;
};
