import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Calculator, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

function TabIcon({ icon: Icon, color, label }: { icon: typeof Calculator; color: string; label: string }) {
  return (
    <View style={tabIconStyles.container}>
      <Icon size={22} color={color} />
      <Text style={[tabIconStyles.label, { color }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  container: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingTop: 6,
    gap: 4,
    minWidth: 60,
  },
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 0.5,

        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: '#8E8E93',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculator',
          tabBarIcon: ({ color }) => <TabIcon icon={Calculator} color={color} label="Calculator" />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <TabIcon icon={Clock} color={color} label="History" />,
        }}
      />
    </Tabs>
  );
}
