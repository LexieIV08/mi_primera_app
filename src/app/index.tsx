import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.texto}>ESTA ES MI PRIMERA APP MOVIL FUNCIONANDO!!! </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
});