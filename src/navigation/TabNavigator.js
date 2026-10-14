
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';

import { CartContext } from '../context/CartContext';
import PantallaCarrito from '../screens/PantallaCarrito';
import PantallaInicio from '../screens/PantallaInicio';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  // Extraemos el carrito de la memoria global
  const { carrito } = useContext(CartContext);

  // Calculamos cuantos articulos hay en total
  const totalArticulos = carrito.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
          borderTopColor: '#333333',
        },
        tabBarActiveTintColor: '#A259FF',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Carrito') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={PantallaInicio}
        options={{
          title: 'Catálogo',
          tabBarLabel: 'Inicio',
        }}
      />

      <Tab.Screen
        name="Carrito"
        component={PantallaCarrito}
        options={({ navigation }) => ({
          title: `Mi Carrito (${totalArticulos})`,
          tabBarLabel: 'Mi Carrito',

          tabBarBadge:
            !navigation.isFocused() && totalArticulos > 0
              ? totalArticulos
              : null,

          tabBarBadgeStyle: {
            backgroundColor: '#A259FF',
            color: '#FFFFFF',
            fontSize: 10,
            minWidth: 16,
            height: 16,
            lineHeight: 16,
            borderRadius: 8,
          },
        })}
      />
    </Tab.Navigator>
  );
}