import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../credenciales/firebaseConfig";

export default function InicioScreen() {
  const router = useRouter();

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>¡Bienvenido!</Text>
      <Text style={styles.mensaje}>
        Has iniciado sesión correctamente.
      </Text>

      <TouchableOpacity
        style={styles.boton}
        onPress={cerrarSesion}
      >
        <Text style={styles.textoBoton}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  mensaje: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  boton: {
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
  },
});