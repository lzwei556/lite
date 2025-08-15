export const getAttrValue = <T extends object>(obj: T | null | undefined, key: keyof T) => {
  if (!obj) {
    return '-';
  }
  return obj[key];
};
