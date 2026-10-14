
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function AppTabs() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="registro">
        <NativeTabs.Trigger.Label selectedStyle={{ color: '#FFFFFF' }}>
          Registro
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="plus.circle" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="inventario">
        <NativeTabs.Trigger.Label selectedStyle={{ color: '#FFFFFF' }}>
          Inventario
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="list.bullet" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}