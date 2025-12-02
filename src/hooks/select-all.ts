import React from 'react';

export function useSelectAll<Key extends string | number>(keys: Key[]) {
  const [selected, setSelected] = React.useState<Key[]>([]);

  const isAllSelected = selected.length === keys.length && selected.length > 0;
  const isIndeterminate = selected.length > 0 && selected.length!==keys.length;

  const toggleSelectAll = React.useCallback(() => {
    setSelected(isAllSelected ? [] : keys);
  }, [isAllSelected, keys]);

  const toggleOne = React.useCallback((key: Key) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
  }, []);

  return {
    selected,
    setSelected,
    isAllSelected,
    isIndeterminate,
    toggleSelectAll,
    toggleOne
  };
}
