import { useContext, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { InventarioContext } from '../context/InventarioContext';

export default function PantallaRegistro() {
  const { agregarProducto } = useContext(InventarioContext);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [vendedor, setVendedor] = useState('');
  const [categoria, setCategoria] = useState('Electrónica');

  const guardar = () => {
    // Validar que los campos estén completos
    if (
      !nombre.trim() ||
      !precio.trim() ||
      !vendedor.trim()
    ) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    // Validar que el precio sea un número positivo
    const precioNumerico = Number(precio);

    if (!Number.isFinite(precioNumerico) || precioNumerico <= 0) {
      Alert.alert('Error', 'Ingresa un precio válido mayor que cero');
      return;
    }

    // Guardar el producto en el contexto
    agregarProducto(nombre, precioNumerico, categoria, vendedor);

    // Limpiar el formulario
    setNombre('');
    setPrecio('');
    setVendedor('');
    setCategoria('Electrónica');

    Alert.alert('Éxito', 'Producto guardado en la memoria');
  };

  return (
    <ScrollView style={styles.contenedor}>
      <View style={styles.tarjeta}>
        <Text style={styles.label}>Nombre del Producto:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Audífonos Bluetooth"
          placeholderTextColor="#999"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Precio:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 599.99"
          placeholderTextColor="#999"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Vendedor:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del vendedor"
          placeholderTextColor="#999"
          value={vendedor}
          onChangeText={setVendedor}
        />

        <Text style={styles.label}>Categoría:</Text>
        <View style={styles.contenedorCategorias}>
          {['Electrónica', 'Ropa', 'Hogar'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.pildora,
                categoria === cat && styles.pildoraActiva,
              ]}
              onPress={() => setCategoria(cat)}
            >
              <Text
                style={[
                  styles.textoPildora,
                  categoria === cat && styles.textoPildoraActiva,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.botonGuardar}
          onPress={guardar}
        >
          <Text style={styles.textoBotonGuardar}>
            Registrar Producto
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 15,
  },
  tarjeta: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 10,
  },
  label: {
    color: '#CCC',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  contenedorCategorias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pildora: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#333',
    borderRadius: 20,
  },
  pildoraActiva: {
    backgroundColor: '#A259FF',
  },
  textoPildora: {
    color: '#888',
  },
  textoPildoraActiva: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  botonGuardar: {
    backgroundColor: '#A259FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonGuardar: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});