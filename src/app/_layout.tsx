import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { CartProvider } from '../context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#FFFFFF',
          tabBarStyle: {
            backgroundColor: '#1A1A1A',
            borderTopColor: '#333333',
          },
          tabBarActiveTintColor: '#A259FF',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Catálogo',
            tabBarLabel: 'Inicio',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="carrito"
          options={{
            title: 'Mi Carrito',
            tabBarLabel: 'Mi Carrito',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'cart' : 'cart-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </CartProvider>
  );
}