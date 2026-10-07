import { useState } from 'react';

import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Tarea = {
  id: string;
  texto: string;
};

export default function App() {
  const [tarea, setTarea] = useState('');
  const [listaTareas, setListaTareas] = useState<Tarea[]>([]);

  const agregarTarea = () => {
    if (tarea.trim() === '') return;

    setListaTareas([
      ...listaTareas,
      {
        id: Date.now().toString(),
        texto: tarea,
      },
    ]);

    setTarea('');
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Mis Tareas Pendientes</Text>

      <View style={styles.zonaInput}>
        <TextInput
          style={styles.input}
          placeholder="Escribe una tarea..."
          value={tarea}
          onChangeText={setTarea}
        />

        <Button
          title="Agregar"
          onPress={agregarTarea}
          color="#005691"
        />
      </View>

      <FlatList
        data={listaTareas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cajaTarea}>
            <Text style={styles.textoTarea}>{item.texto}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },

  zonaInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    height: 45,
  },

  cajaTarea: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },

  textoTarea: {
    fontSize: 16,
    color: '#444',
  },
});