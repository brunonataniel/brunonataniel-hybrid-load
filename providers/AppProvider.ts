import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { UnitSystem, LiftType, convertWeight } from '@/utils/plateCalculator';

const STORAGE_KEYS = {
  maxLift: 'hybrid_load_max_lift',
  unit: 'hybrid_load_unit',
} as const;

export const [AppProvider, useApp] = createContextHook(() => {
  const [maxLift, setMaxLift] = useState<string>('315');
  const [unit, setUnit] = useState<UnitSystem>('lbs');
  const [selectedLift, setSelectedLift] = useState<LiftType>('squat');

  const storedDataQuery = useQuery({
    queryKey: ['stored-data'],
    queryFn: async () => {
      const [storedMax, storedUnit] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.maxLift),
        AsyncStorage.getItem(STORAGE_KEYS.unit),
      ]);
      return {
        maxLift: storedMax ?? '315',
        unit: (storedUnit as UnitSystem) ?? 'lbs',
      };
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (storedDataQuery.data) {
      setMaxLift(storedDataQuery.data.maxLift);
      setUnit(storedDataQuery.data.unit);
    }
  }, [storedDataQuery.data]);

  const { mutate: saveMax } = useMutation({
    mutationFn: async (value: string) => {
      await AsyncStorage.setItem(STORAGE_KEYS.maxLift, value);
      return value;
    },
  });

  const { mutate: saveUnit } = useMutation({
    mutationFn: async (value: UnitSystem) => {
      await AsyncStorage.setItem(STORAGE_KEYS.unit, value);
      return value;
    },
  });

  const updateMaxLift = useCallback((value: string) => {
    setMaxLift(value);
    saveMax(value);
  }, [saveMax]);

  const updateUnit = useCallback((newUnit: UnitSystem) => {
    setUnit((prevUnit) => {
      if (prevUnit === newUnit) return prevUnit;
      const currentVal = parseFloat(maxLift);
      if (!isNaN(currentVal) && currentVal > 0) {
        const converted = convertWeight(currentVal, prevUnit, newUnit);
        const convertedStr = String(converted);
        setMaxLift(convertedStr);
        saveMax(convertedStr);
      }
      return newUnit;
    });
    saveUnit(newUnit);
  }, [maxLift, saveMax, saveUnit]);

  const { mutate: saveLift } = useMutation({
    mutationFn: async (value: LiftType) => {
      await AsyncStorage.setItem('hybrid_load_lift', value);
      return value;
    },
  });

  const updateLift = useCallback((lift: LiftType) => {
    setSelectedLift(lift);
    saveLift(lift);
  }, [saveLift]);

  return useMemo(() => ({
    maxLift,
    unit,
    isLoading: storedDataQuery.isLoading,
    updateMaxLift,
    updateUnit,
    selectedLift,
    updateLift,
  }), [maxLift, unit, storedDataQuery.isLoading, updateMaxLift, updateUnit, selectedLift, updateLift]);
});
