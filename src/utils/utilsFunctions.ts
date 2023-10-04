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
