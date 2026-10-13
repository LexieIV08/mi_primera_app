
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Empleado = {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  foto: string;
};

export default function App() {
  const [pantallaActual, setPantallaActual] = useState('registro');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    descargarEmpleados();
  }, []);

  const descargarEmpleados = async () => {
    try {
      const respuesta = await fetch(
        'https://randomuser.me/api/?results=5'
      );
      const json = await respuesta.json();

      const empleadosAdaptados: Empleado[] = json.results.map(
        (usuario: any, indice: number) => ({
          id: usuario.login.uuid || String(indice),
          nombre: `${usuario.name.first} ${usuario.name.last}`,
          correo: usuario.email,
          telefono: usuario.phone,
          foto: usuario.picture.large,
        })
      );

      setEmpleados(empleadosAdaptados);
    } catch (error) {
      console.error('Error descargando empleados:', error);
      Alert.alert(
        'Aviso',
        'No se pudieron descargar los empleados. Puedes registrar uno manualmente.'
      );
    } finally {
      setCargando(false);
    }
  };

  const agregarEmpleadoManual = () => {
    if (
      nombre.trim() === '' ||
      correo.trim() === '' ||
      telefono.trim() === ''
    ) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }

    if (!correo.includes('@') || !correo.includes('.')) {
      Alert.alert('Error', 'Ingresa un correo válido.');
      return;
    }

    if (!/^\d{10}$/.test(telefono)) {
      Alert.alert(
        'Error',
        'El teléfono debe tener exactamente 10 dígitos.'
      );
      return;
    }

    const nuevoEmpleado: Empleado = {
      id: `manual-${Date.now()}`,
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono,
      foto: `https://i.pravatar.cc/150?u=${Date.now()}`,
    };

    setEmpleados((anteriores) => [nuevoEmpleado, ...anteriores]);

    Alert.alert('Éxito', 'El empleado fue registrado correctamente.');

    setNombre('');
    setCorreo('');
    setTelefono('');
  };

  if (cargando) {
    return (
      <View style={styles.pantallaCentrada}>
        <ActivityIndicator size="large" color="#005691" />
        <Text style={styles.textoCarga}>
          Descargando empleados...
        </Text>
      </View>
    );
  }

  if (pantallaActual === 'lista') {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.tituloPrincipal}>
          Directorio de Empleados
        </Text>

        <View style={styles.espaciadoBoton}>
          <Button
            title="Volver al registro"
            color="#005691"
            onPress={() => setPantallaActual('registro')}
          />
        </View>

        <FlatList
          data={empleados}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text>No hay empleados registrados.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.tarjetaUsuario}>
              <Image
                source={{ uri: item.foto }}
                style={styles.imagenPerfil}
              />
              <View style={styles.infoUsuario}>
                <Text style={styles.nombreUsuario}>
                  {item.nombre}
                </Text>
                <Text style={styles.textoDetalle}>
                  {item.correo}
                </Text>
                <Text style={styles.textoDetalle}>
                  Teléfono: {item.telefono}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.fondo}
      contentContainerStyle={styles.contenedorRegistro}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.tituloPrincipal}>Nuevo Ingreso</Text>

      <Text style={styles.etiqueta}>Nombre completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe el nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.etiqueta}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="ejemplo@correo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />

      <Text style={styles.etiqueta}>Teléfono (10 dígitos)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 4421234567"
        keyboardType="number-pad"
        maxLength={10}
        value={telefono}
        onChangeText={(texto) =>
          setTelefono(texto.replace(/\D/g, ''))
        }
      />

      <View style={styles.espaciadoBoton}>
        <Button
          title="Agregar empleado"
          color="#218838"
          onPress={agregarEmpleadoManual}
        />
      </View>

      <View style={styles.espaciadoBoton}>
        <Button
          title="Ver lista de empleados"
          color="#005691"
          onPress={() => setPantallaActual('lista')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  contenedor: {
    flex: 1,
    backgroundColor: '#f4f7f6',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  contenedorRegistro: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  pantallaCentrada: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  textoCarga: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
  },
  tituloPrincipal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 15,
  },
  espaciadoBoton: {
    marginBottom: 15,
  },
  tarjetaUsuario: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagenPerfil: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  infoUsuario: {
    flex: 1,
    justifyContent: 'center',
  },
  nombreUsuario: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  textoDetalle: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
});