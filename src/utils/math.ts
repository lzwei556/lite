export const findClosest = (array: number[], num: number) => {
  if (array == null) {
    return num;
  }
  const target = [...array].sort((a, b) => Math.abs(b - num) - Math.abs(a - num)).pop();
  return target ?? num;
};
