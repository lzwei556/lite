export const findClosest = (array: number[], num: number) => {
  if (array == null) {
    return;
  }
  return array.sort((a, b) => Math.abs(b - num) - Math.abs(a - num)).pop();
};
