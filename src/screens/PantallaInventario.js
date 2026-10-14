import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { InventarioContext } from '../context/InventarioContext';

export default function PantallaInventario() {
  const { productos, eliminarProducto, actualizarProducto } =
    useContext(InventarioContext);

  // Estados del modal de edición
  const [modalVisible, setModalVisible] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editVendedor, setEditVendedor] = useState('');
  const [editCategoria, setEditCategoria] = useState('');

  // Abrir el modal con los datos del producto seleccionado
  const abrirModalEdicion = (producto) => {
    setIdEditando(producto.id);
    setEditNombre(producto.nombre);
    setEditPrecio(producto.precio.toString());
    setEditVendedor(producto.vendedor);
    setEditCategoria(producto.categoria);
    setModalVisible(true);
  };

  // Guardar los cambios del producto
  const guardarEdicion = () => {
    if (
      !editNombre.trim() ||
      !editPrecio.trim() ||
      !editVendedor.trim()
    ) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const precioNumerico = Number(editPrecio);

    if (!Number.isFinite(precioNumerico) || precioNumerico <= 0) {
      Alert.alert('Error', 'Ingresa un precio válido mayor que cero');
      return;
    }

    actualizarProducto(
      idEditando,
      editNombre,
      precioNumerico,
      editCategoria,
      editVendedor
    );

    setModalVisible(false);
    Alert.alert('Actualizado', 'Los datos se modificaron correctamente');
  };

  // Eliminar un producto con confirmación
  const confirmarEliminacion = (id) => {
    Alert.alert(
      'Eliminar producto',
      '¿Seguro que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => eliminarProducto(id),
        },
      ]
    );
  };

  return (
    <View style={styles.contenedor}>
      {productos.length === 0 ? (
        <View style={styles.centro}>
          <Ionicons
            name="folder-open-outline"
            size={60}
            color="#555"
          />
          <Text style={styles.textoVacio}>
            No hay productos registrados
          </Text>
        </View>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <View style={styles.info}>
                <Text style={styles.titulo}>{item.nombre}</Text>

                <Text style={styles.precio}>
                  Precio: ${Number(item.precio).toFixed(2)}
                </Text>

                <Text style={styles.detalle}>
                  Categoría: {item.categoria}
                </Text>

                <Text style={styles.detalle}>
                  Vendedor: {item.vendedor}
                </Text>
              </View>

              <View style={styles.controles}>
                <TouchableOpacity
                  style={styles.botonEditar}
                  onPress={() => abrirModalEdicion(item)}
                  accessibilityLabel="Editar producto"
                >
                  <Ionicons
                    name="pencil"
                    size={20}
                    color="#FFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botonEliminar}
                  onPress={() => confirmarEliminacion(item.id)}
                  accessibilityLabel="Eliminar producto"
                >
                  <Ionicons
                    name="trash"
                    size={20}
                    color="#FFF"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalTarjeta}>
            <Text style={styles.modalTitulo}>
              Editar Producto
            </Text>

            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              style={styles.input}
              value={editNombre}
              onChangeText={setEditNombre}
              placeholder="Nombre"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Precio:</Text>
            <TextInput
              style={styles.input}
              value={editPrecio}
              onChangeText={setEditPrecio}
              placeholder="Precio"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Vendedor:</Text>
            <TextInput
              style={styles.input}
              value={editVendedor}
              onChangeText={setEditVendedor}
              placeholder="Vendedor"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Categoría:</Text>
            <TextInput
              style={styles.input}
              value={editCategoria}
              onChangeText={setEditCategoria}
              placeholder="Categoría"
              placeholderTextColor="#999"
            />

            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textoBoton}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonGuardarModal}
                onPress={guardarEdicion}
              >
                <Text style={styles.textoBoton}>
                  Guardar Cambios
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 15,
  },
  lista: {
    paddingBottom: 15,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoVacio: {
    color: '#888',
    marginTop: 10,
    fontSize: 16,
  },
  tarjeta: {
    backgroundColor: '#1A1A1A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  titulo: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  precio: {
    color: '#A259FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  detalle: {
    color: '#AAA',
    fontSize: 14,
    marginTop: 3,
  },
  controles: {
    flexDirection: 'row',
    gap: 10,
  },
  botonEditar: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
  },
  botonEliminar: {
    backgroundColor: '#FF5252',
    padding: 10,
    borderRadius: 8,
  },
  modalFondo: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  modalTarjeta: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 15,
  },
  modalTitulo: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    color: '#CCC',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botonCancelar: {
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  botonGuardarModal: {
    backgroundColor: '#A259FF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});