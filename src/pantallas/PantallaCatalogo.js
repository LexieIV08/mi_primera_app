import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { PRODUCTOS } from '../productos/productos';

export default function PantallaCatalogo() {
  const router = useRouter();

  return (
    <View style={styles.contenedorOscuro}>
      <FlatList
        data={PRODUCTOS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tarjetaProducto}
            onPress={() => router.push(`/producto/${item.id}`)}
          >
            <Image
              source={item.imagen}
              style={styles.imagenCatalogo}
            />

            <View style={styles.infoCatalogo}>
              <Text style={styles.textoNombre} numberOfLines={1}>
                {item.nombre}
              </Text>

              <Text style={styles.textoPrecio}>
                {item.precio}
              </Text>

              <Text style={styles.textoVerMas}>
                Ver detalles{' '}
                <Ionicons name="arrow-forward" size={12} />
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorOscuro: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  tarjetaProducto: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },

  imagenCatalogo: {
    width: 120,
    height: 120,
  },

  infoCatalogo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },

  textoNombre: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  textoPrecio: {
    color: '#A259FF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  textoVerMas: {
    color: '#888888',
    fontSize: 14,
  },
});