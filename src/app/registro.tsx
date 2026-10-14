import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth } from "../credenciales/firebaseConfig";

export default function RegistroScreen() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const registrar = async () => {
    if (!correo.trim() || !password) {
      Alert.alert("Aviso", "Escribe tu correo y contraseña.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        auth,
        correo.trim(),
        password
      );

      Alert.alert("Éxito", "Tu cuenta se creó correctamente.", [
        {
          text: "Continuar",
          onPress: () => router.replace("/inicio"),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={correo}
        onChangeText={setCorreo}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña (mínimo 6 caracteres)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.boton} onPress={registrar}>
        <Text style={styles.textoBoton}>Registrarme</Text>
      </TouchableOpacity>

      <Link href="/login" style={styles.enlace}>
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  boton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
  },
  enlace: {
    color: "#2563eb",
    textAlign: "center",
    marginTop: 20,
  },
});