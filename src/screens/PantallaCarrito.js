
import { useContext } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';

export default function PantallaCarrito() {
  // Extraemos las funciones y los datos del contexto
  const {
    carrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
  } = useContext(CartContext);

  // Calculamos el subtotal
  const subtotal = carrito.reduce(
    (acumulador, item) =>
      acumulador + item.price * item.cantidad,
    0
  );

  // Calculamos el envio del 5% y el total final
  const costoEnvio = subtotal * 0.05;
  const totalFinal = subtotal + costoEnvio;

  // Si el carrito está vacío, mostramos este mensaje
  if (carrito.length === 0) {
    return (
      <View style={styles.centro}>
        <Ionicons name="cart-outline" size={80} color="#333" />
        <Text style={styles.textoVacio}>
          Tu carrito está vacío
        </Text>
      </View>
    );
  }

  // Procesamos el pago y vaciamos el carrito al confirmar
  const procesarPago = () => {
    Alert.alert(
      'Confirmar compra',
      `Subtotal: $${subtotal.toFixed(2)}\n` +
        `Envío (5%): $${costoEnvio.toFixed(2)}\n` +
        `Total a pagar: $${totalFinal.toFixed(2)}\n\n` +
        '¿Deseas confirmar tu compra?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar pago',
          onPress: () => {
            vaciarCarrito();
            Alert.alert(
              '¡Compra realizada!',
              'Tu pago se ha procesado correctamente.'
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={carrito}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
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
                ${(item.price * item.cantidad).toFixed(2)}
              </Text>

              <View style={styles.controles}>
                <TouchableOpacity
                  onPress={() =>
                    cambiarCantidad(item.id, 'restar')
                  }
                  style={styles.botonCirculo}
                >
                  <Ionicons
                    name="remove"
                    size={16}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                <Text style={styles.cantidad}>
                  {item.cantidad}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    cambiarCantidad(item.id, 'sumar')
                  }
                  style={styles.botonCirculo}
                >
                  <Ionicons
                    name="add"
                    size={16}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => eliminarDelCarrito(item.id)}
                  style={styles.botonBasura}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#FF5252"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* TICKET DE COMPRA */}
      <View style={styles.ticket}>
        <View style={styles.filaTicket}>
          <Text style={styles.textoTicket}>Subtotal:</Text>
          <Text style={styles.textoTicket}>
            ${subtotal.toFixed(2)}
          </Text>
        </View>

        <View style={styles.filaTicket}>
          <Text style={styles.textoTicketEnvio}>
            Envío (5%):
          </Text>
          <Text style={styles.textoTicketEnvio}>
            ${costoEnvio.toFixed(2)}
          </Text>
        </View>

        <View style={[styles.filaTicket, styles.filaTotal]}>
          <Text style={styles.textoTotal}>
            Total:
          </Text>
          <Text style={styles.textoTotalGrande}>
            ${totalFinal.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.botonPagar}
          onPress={procesarPago}
        >
          <Text style={styles.textoBotonPagar}>
            Proceder al Pago
          </Text>
        </TouchableOpacity>
      </View>
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
  textoVacio: {
    color: '#888',
    fontSize: 18,
    marginTop: 10,
  },
  lista: {
    paddingBottom: 10,
  },
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    margin: 15,
    marginBottom: 5,
    borderRadius: 10,
    padding: 10,
  },
  imagen: {
    width: 80,
    height: 80,
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
  },
  precio: {
    color: '#A259FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  botonCirculo: {
    backgroundColor: '#333',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cantidad: {
    color: '#FFFFFF',
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonBasura: {
    marginLeft: 'auto',
  },
  ticket: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  filaTicket: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textoTicket: {
    color: '#CCC',
    fontSize: 16,
  },
  textoTicketEnvio: {
    color: '#888',
    fontSize: 14,
  },
  filaTotal: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 15,
    marginTop: 5,
  },
  textoTotal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textoTotalGrande: {
    color: '#A259FF',
    fontSize: 22,
    fontWeight: '900',
  },
  botonPagar: {
    backgroundColor: '#A259FF',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 15,
  },
  textoBotonPagar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});