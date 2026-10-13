
/*
El código visto en clase no estaba en su repo,
realicé una versión sencilla de la práctica utilizando
la librería expo-image-picker, indicada en la práctica*/

import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function App() {
  const [imagen, setImagen] = useState<string | null>(null);

  const seleccionarFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Galería de Fotos</Text>

      <View style={styles.marcoImagen}>
        {imagen ? (
          <Image
            source={{ uri: imagen }}
            style={styles.imagen}
          />
        ) : (
          <Text style={styles.textoPlaceholder}>
            Aquí aparecerá tu foto
          </Text>
        )}
      </View>

      <View style={styles.boton}>
        <Button
          title="Seleccionar foto"
          color="#2563eb"
          onPress={seleccionarFoto}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7f6',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
  },
  marcoImagen: {
    width: 280,
    height: 280,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 25,
  },
  imagen: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textoPlaceholder: {
    color: '#777',
    fontSize: 16,
  },
  boton: {
    width: '100%',
    maxWidth: 280,
  },
});