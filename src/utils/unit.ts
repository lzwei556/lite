export function formatDaysToPeriod(totalDays: number) {
  const DAYS_PER_YEAR = 365;

  if (totalDays < DAYS_PER_YEAR) {
    const days = Math.round(totalDays);
    return [{ value: days, unit: formatUnitTranslationKeyWithPlural(days, 'label.unit.day') }];
  }

  const years = Math.floor(totalDays / DAYS_PER_YEAR);
  const remainingDays = Math.round(totalDays % DAYS_PER_YEAR);

  const result = [
    {
      value: years,
      unit: formatUnitTranslationKeyWithPlural(years, 'label.unit.year')
    }
  ];

  if (remainingDays > 0) {
    result.push({
      value: remainingDays,
      unit: formatUnitTranslationKeyWithPlural(remainingDays, 'label.unit.day')
    });
  }

  return result;
}

export const formatUnitTranslationKeyWithPlural = (value: number, baseUnit: string): string => {
  // 定义需要处理复数的单位
  const pluralizableUnits = ['year', 'day'];

  const shouldAddPlural = pluralizableUnits.some(
    (unit) => baseUnit.toLowerCase().includes(unit) && Math.abs(value) > 1
  );

  return shouldAddPlural ? `${baseUnit}s` : baseUnit;
};
