import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Práctica 12</Text>

      <Text style={styles.subtitulo}>
        Autenticación con Firebase
      </Text>

      <Link href="/login" asChild>
        <TouchableOpacity style={styles.botonLogin}>
          <Text style={styles.textoBoton}>Iniciar sesión</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/registro" asChild>
        <TouchableOpacity style={styles.botonRegistro}>
          <Text style={styles.textoBoton}>Crear cuenta</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 18,
    color: "#555555",
    marginBottom: 35,
    textAlign: "center",
  },
  botonLogin: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  botonRegistro: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  textoBoton: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});