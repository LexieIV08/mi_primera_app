import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { PRODUCTOS } from '../../productos/productos';

export default function DetalleProducto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const productoSeleccionado = PRODUCTOS.find(
    (producto) => producto.id === id
  );

  if (!productoSeleccionado) {
    return (
      <View style={styles.contenedorOscuro}>
        <Text style={styles.textoDescripcion}>
          No se encontró el producto.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedorOscuro}>
      <Stack.Screen
        options={{
          title: productoSeleccionado.nombre,
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Image
          source={productoSeleccionado.imagen}
          style={styles.imagenDetalle}
        />

        <View style={styles.contenedorInfoDetalle}>
          <Text style={styles.textoNombreGrande}>
            {productoSeleccionado.nombre}
          </Text>

          <Text style={styles.textoPrecioGrande}>
            {productoSeleccionado.precio}
          </Text>

          <View style={styles.lineaSeparadora} />

          <Text style={styles.etiquetaSeccion}>Descripción</Text>
          <Text style={styles.textoDescripcion}>
            {productoSeleccionado.descripcion}
          </Text>

          <View style={styles.lineaSeparadora} />

          <Text style={styles.etiquetaSeccion}>
            Características principales
          </Text>

          {productoSeleccionado.caracteristicas.map((item, index) => (
            <View key={index} style={styles.filaCaracteristica}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#A259FF"
              />
              <Text style={styles.textoCaracteristica}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.zonaBoton}>
        <TouchableOpacity
          style={styles.botonComprar}
          onPress={() => {
            // Por ahora, el botón muestra una confirmación sencilla.
            // Después podemos implementar un carrito real.
            alert('Producto seleccionado: ' + productoSeleccionado.nombre);
          }}
        >
          <Ionicons name="cart" size={24} color="white" />
          <Text style={styles.textoBotonComprar}>
            Agregar al carrito
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorOscuro: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  imagenDetalle: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },

  contenedorInfoDetalle: {
    padding: 25,
  },

  textoNombreGrande: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  textoPrecioGrande: {
    color: '#A259FF',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 15,
  },

  lineaSeparadora: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 20,
  },

  etiquetaSeccion: {
    color: '#888888',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
    fontWeight: 'bold',
  },

  textoDescripcion: {
    color: '#CCCCCC',
    fontSize: 16,
    lineHeight: 26,
  },

  filaCaracteristica: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  textoCaracteristica: {
    color: '#E0E0E0',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },

  zonaBoton: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
  },

  botonComprar: {
    backgroundColor: '#A259FF',
    flexDirection: 'row',
    padding: 18,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  textoBotonComprar: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});