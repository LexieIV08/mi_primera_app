import { useRouter } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>👤</Text>

      <Text style={styles.title}>
        ¡Bienvenido a Mi Perfil!
      </Text>

      <Text style={styles.description}>
        Administra tu información personal,
        personaliza tu perfil y guarda tus cambios
        de forma segura.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push('/perfil')}
      >
        <Text style={styles.buttonText}>
          Ver mi perfil
        </Text>
      </Pressable>

      <Text style={styles.footer}>
        Práctica 13 · Perfil en Firestore
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F4F6FA',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#26345C',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5D6475',
    textAlign: 'center',
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#5267D9',
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 32,
    color: '#777F90',
    fontSize: 13,
    textAlign: 'center',
  },
});