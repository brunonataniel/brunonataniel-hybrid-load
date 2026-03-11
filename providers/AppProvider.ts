import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { UnitSystem, LiftType, FatigueType, convertWeight } from '@/utils/plateCalculator';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  lift: LiftType;
  oneRepMax: number;
  targetPercent: number;
  fatigues: FatigueType[];
  finalWeight: number;
  unit: UnitSystem;
  totalPenalty: number;
}

const STORAGE_KEYS = {
  maxLift: 'hybrid_load_max_lift',
  unit: 'hybrid_load_unit',
  history: 'hybrid_load_history',
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

  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const historyQuery = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.history);
      return stored ? (JSON.parse(stored) as HistoryEntry[]) : [];
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (historyQuery.data) {
      setHistory(historyQuery.data);
    }
  }, [historyQuery.data]);

  const { mutate: saveHistory } = useMutation({
    mutationFn: async (entries: HistoryEntry[]) => {
      await AsyncStorage.setItem(STORAGE_KEYS.history, JSON.stringify(entries));
      return entries;
    },
  });

  const addHistoryEntry = useCallback((entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
    };
    const updated = [newEntry, ...history].slice(0, 100);
    setHistory(updated);
    saveHistory(updated);
    console.log('[History] Entry added:', newEntry.lift, newEntry.finalWeight, newEntry.unit);
  }, [history, saveHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
    console.log('[History] Cleared');
  }, [saveHistory]);

  return useMemo(() => ({
    maxLift,
    unit,
    isLoading: storedDataQuery.isLoading,
    updateMaxLift,
    updateUnit,
    selectedLift,
    updateLift,
    history,
    addHistoryEntry,
    clearHistory,
  }), [maxLift, unit, storedDataQuery.isLoading, updateMaxLift, updateUnit, selectedLift, updateLift, history, addHistoryEntry, clearHistory]);
});
