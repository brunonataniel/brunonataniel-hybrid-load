import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { FatigueType, UnitSystem, convertWeight } from '@/utils/plateCalculator';

export interface HistoryEntry {
  id: string;
  oneRepMax: number;
  targetPercent: number;
  fatigueTypes: FatigueType[];
  fatigueState?: string;
  unit: UnitSystem;
  finalWeight: number;
  timestamp: number;
}

const STORAGE_KEYS = {
  maxLift: 'hybrid_load_max_lift',
  unit: 'hybrid_load_unit',
  history: 'hybrid_load_history',
  proUnlocked: 'hybrid_load_pro_unlocked',
} as const;

const MAX_HISTORY = 5;

export const [AppProvider, useApp] = createContextHook(() => {
  const [maxLift, setMaxLift] = useState<string>('315');
  const [unit, setUnit] = useState<UnitSystem>('lbs');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isProUnlocked, setIsProUnlocked] = useState<boolean>(false);

  const storedDataQuery = useQuery({
    queryKey: ['stored-data'],
    queryFn: async () => {
      const [storedMax, storedUnit, storedHistory] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.maxLift),
        AsyncStorage.getItem(STORAGE_KEYS.unit),
        AsyncStorage.getItem(STORAGE_KEYS.history),
      ]);
      const storedPro = await AsyncStorage.getItem(STORAGE_KEYS.proUnlocked);
      return {
        maxLift: storedMax ?? '315',
        unit: (storedUnit as UnitSystem) ?? 'lbs',
        history: storedHistory ? (JSON.parse(storedHistory) as HistoryEntry[]) : [],
        proUnlocked: storedPro === 'true',
      };
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (storedDataQuery.data) {
      setMaxLift(storedDataQuery.data.maxLift);
      setUnit(storedDataQuery.data.unit);
      setHistory(storedDataQuery.data.history);
      setIsProUnlocked(storedDataQuery.data.proUnlocked);
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

  const { mutate: saveHistory } = useMutation({
    mutationFn: async (entries: HistoryEntry[]) => {
      await AsyncStorage.setItem(STORAGE_KEYS.history, JSON.stringify(entries));
      return entries;
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

  const addHistoryEntry = useCallback((entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    setHistory((prev) => {
      const newEntry: HistoryEntry = {
        ...entry,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      const updated = [newEntry, ...prev].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
  }, [saveHistory]);

  const { mutate: savePro } = useMutation({
    mutationFn: async (value: boolean) => {
      await AsyncStorage.setItem(STORAGE_KEYS.proUnlocked, String(value));
      return value;
    },
  });

  const unlockPro = useCallback(() => {
    setIsProUnlocked(true);
    savePro(true);
  }, [savePro]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, [saveHistory]);

  return useMemo(() => ({
    maxLift,
    unit,
    history,
    isLoading: storedDataQuery.isLoading,
    updateMaxLift,
    isProUnlocked,
    updateUnit,
    addHistoryEntry,
    clearHistory,
    unlockPro,
  }), [maxLift, unit, history, storedDataQuery.isLoading, updateMaxLift, isProUnlocked, updateUnit, addHistoryEntry, clearHistory, unlockPro]);
});
