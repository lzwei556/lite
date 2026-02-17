export const findClosest = (array: number[] | null, num: number) => {
  if (!array || array.length === 0) return num;

  let closest = array[0];
  let minDiff = Math.abs(closest - num);

  for (let i = 1; i < array.length; i++) {
    const diff = Math.abs(array[i] - num);
    if (diff < minDiff) {
      minDiff = diff;
      closest = array[i];
    }
  }

  return closest;
};
