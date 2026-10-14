
import { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';

export default function PantallaInicio() {
  const { agregarAlCarrito } = useContext(CartContext);

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('todos');

  // Consumimos la API al cargar la pantalla
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error('No se pudieron cargar los productos');
        }
        return res.json();
      })
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => {
        console.error('Error al cargar productos:', error);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  // Motor de filtrado: búsqueda por texto y categoría
  const productosFiltrados = productos.filter((item) => {
    const coincideTexto = item.title
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaActiva === 'todos' ||
      item.category === categoriaActiva;

    return coincideTexto && coincideCategoria;
  });

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#A259FF" />
        <Text style={styles.textoCarga}>Cargando productos...</Text>
      </View>
    );
  }

  // Botón reutilizable para los filtros
  const renderFiltro = (categoria, etiqueta) => (
    <TouchableOpacity
      key={categoria}
      style={[
        styles.pildora,
        categoriaActiva === categoria && styles.pildoraActiva,
      ]}
      onPress={() => setCategoriaActiva(categoria)}
    >
      <Text
        style={
          categoriaActiva === categoria
            ? styles.textoPildoraActiva
            : styles.textoPildora
        }
      >
        {etiqueta}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.contenedor}>
      {/* BARRA DE BUSQUEDA */}
      <View style={styles.cajaBusqueda}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar producto..."
          placeholderTextColor="#888"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* FILTROS DE CATEGORIAS */}
      <View style={styles.contenedorFiltros}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderFiltro('todos', 'Todos')}
          {renderFiltro('electronics', 'Electrónica')}
          {renderFiltro('jewelery', 'Joyería')}
          {renderFiltro("men's clothing", 'Ropa de Hombre')}
          {renderFiltro("women's clothing", 'Ropa de Mujer')}
        </ScrollView>
      </View>

      {/* LISTA DE PRODUCTOS */}
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.textoVacio}>
            No se encontraron productos.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Image
              source={{ uri: item.image }}
              style={styles.imagen}
            />

            <View style={styles.info}>
              <Text style={styles.titulo} numberOfLines={2}>
                {item.title}
              </Text>

              <Text style={styles.precio}>
                ${item.price.toFixed(2)}
              </Text>

              <TouchableOpacity
                style={styles.botonAgregar}
                onPress={() => agregarAlCarrito(item)}
              >
                <Text style={styles.textoBoton}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  textoCarga: {
    color: '#FFFFFF',
    marginTop: 12,
  },
  cajaBusqueda: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    margin: 15,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  inputBusqueda: {
    flex: 1,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  contenedorFiltros: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  pildora: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    marginRight: 10,
  },
  pildoraActiva: {
    backgroundColor: '#A259FF',
  },
  textoPildora: {
    color: '#888888',
  },
  textoPildoraActiva: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  lista: {
    paddingBottom: 15,
  },
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  imagen: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  info: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  precio: {
    color: '#A259FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botonAgregar: {
    backgroundColor: '#333333',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  textoVacio: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 30,
  },
});