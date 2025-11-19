enum FaultCategoryValue {
  BearingOuterRace,
  BearingInnerRace
}

enum FaultCategoryLabel {
  BearingOuterRace = 'fault.category.bearing.outer.race',
  BearingInnerRace = 'fault.category.bearing.inner.race'
}

type FaultCategory = { label: FaultCategoryLabel; value: FaultCategoryValue };

enum FaultDescription {
  BearingOuterRace = 'fault.description.bearing.outer.race',
  BearingInnerRace = 'fault.description.bearing.inner.race'
}

enum FaultSeverityValue {
  None = 0,
  Minor = 1,
  Major = 2,
  Critical = 3
}

enum FaultSeverityLabel {
  None = 'fault.severity.none',
  Minor = 'fault.severity.minor',
  Major = 'fault.severity.major',
  Critical = 'fault.severity.critical'
}

type FaultSeverity = { label: FaultSeverityLabel; value: FaultSeverityValue };

enum FaultSuggestion {
  BearingOuterRace = 'fault.suggestion.bearing.outer.race',
  BearingInnerRace = 'fault.suggestion.bearing.inner.race'
}

export type Fault = {
  category: FaultCategory;
  description: FaultDescription;
  severity: FaultSeverity;
  suggestion: FaultSuggestion;
};

const faultTable: Record<
  FaultCategoryValue,
  Omit<Fault, 'category'> & { categoryLabel: FaultCategoryLabel }
> = {
  [FaultCategoryValue.BearingOuterRace]: {
    categoryLabel: FaultCategoryLabel.BearingOuterRace,
    description: FaultDescription.BearingOuterRace,
    severity: { label: FaultSeverityLabel.Critical, value: FaultSeverityValue.Critical },
    suggestion: FaultSuggestion.BearingOuterRace
  },
  [FaultCategoryValue.BearingInnerRace]: {
    categoryLabel: FaultCategoryLabel.BearingInnerRace,
    description: FaultDescription.BearingInnerRace,
    severity: { label: FaultSeverityLabel.Critical, value: FaultSeverityValue.Critical },
    suggestion: FaultSuggestion.BearingInnerRace
  }
};

export const getFaultByCategory = (value: FaultCategoryValue): Fault => {
  const entry = faultTable[value];
  return { category: { value, label: entry.categoryLabel }, ...entry };
};
