
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const canciones = [
  {
    id: '1',
    titulo: 'SoundHelix Song 1',
    artista: 'SoundHelix',
    portada: 'https://picsum.photos/id/12/200/200',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    titulo: 'SoundHelix Song 2',
    artista: 'SoundHelix',
    portada: 'https://picsum.photos/id/24/200/200',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    titulo: 'SoundHelix Song 3',
    artista: 'SoundHelix',
    portada: 'https://picsum.photos/id/39/200/200',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function App() {
  const [busqueda, setBusqueda] = useState('');
  const [cancionActual, setCancionActual] = useState<
    (typeof canciones)[number] | null
  >(null);

  const reproductor = useAudioPlayer(null);
  const estadoAudio = useAudioPlayerStatus(reproductor);
  const sonando = estadoAudio.playing;

  const listaFiltrada = canciones.filter((cancion) =>
    `${cancion.titulo} ${cancion.artista}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const reproducirCancion = (cancion: (typeof canciones)[number]) => {
    try {
      setCancionActual(cancion);
      reproductor.replace(cancion.audio);
      reproductor.play();
    } catch {
      Alert.alert(
        'No se pudo reproducir',
        'Comprueba tu conexión a internet e inténtalo de nuevo.'
      );
    }
  };

  const alternarReproduccion = () => {
    if (!cancionActual) {
      reproducirCancion(canciones[0]);
      return;
    }

    if (sonando) {
      reproductor.pause();
    } else {
      reproductor.play();
    }
  };

  return (
    <View style={styles.contenedor}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0514" />

      <View style={styles.encabezado}>
        <Text style={styles.tituloHeader}>Explorador musical</Text>
        <Text style={styles.subtitulo}>Tu música, tu ambiente.</Text>

        <View style={styles.contenedorBusqueda}>
          <TextInput
            style={styles.input}
            placeholder="Buscar canción o artista..."
            placeholderTextColor="#888"
            value={busqueda}
            onChangeText={setBusqueda}
          />
          <View style={styles.botonBuscar}>
            <Text style={styles.iconoBuscar}>⌕</Text>
          </View>
        </View>
      </View>

      <Text style={styles.tituloSeccion}>Canciones para descubrir</Text>

      <ScrollView
        style={styles.lista}
        contentContainerStyle={styles.contenidoLista}
        showsVerticalScrollIndicator={false}
      >
        {listaFiltrada.length === 0 ? (
          <View style={styles.zonaCentrada}>
            <Text style={styles.textoVacio}>
              No se encontraron canciones.
            </Text>
          </View>
        ) : (
          listaFiltrada.map((cancion) => (
            <Pressable
              key={cancion.id}
              style={styles.tarjetaCancion}
              onPress={() => reproducirCancion(cancion)}
            >
              <Image
                source={{ uri: cancion.portada }}
                style={styles.portada}
              />

              <View style={styles.infoCancion}>
                <Text style={styles.tituloCancion}>
                  {cancion.titulo}
                </Text>
                <Text style={styles.artistaCancion}>
                  {cancion.artista}
                </Text>
              </View>

              {cancionActual?.id === cancion.id && sonando ? (
                <View style={styles.contenedorEcualizador}>
                  <View
                    style={[styles.barraEcualizador, { height: 10 }]}
                  />
                  <View
                    style={[styles.barraEcualizador, { height: 20 }]}
                  />
                  <View
                    style={[styles.barraEcualizador, { height: 14 }]}
                  />
                </View>
              ) : (
                <Text style={styles.iconoPlay}>▶</Text>
              )}
            </Pressable>
          ))
        )}
      </ScrollView>

      {cancionActual && (
        <View style={styles.miniReproductor}>
          <View style={styles.interiorMiniReproductor}>
            <Image
              source={{ uri: cancionActual.portada }}
              style={styles.portadaMini}
            />

            <View style={styles.infoMini}>
              <Text numberOfLines={1} style={styles.tituloMini}>
                {cancionActual.titulo}
              </Text>
              <Text numberOfLines={1} style={styles.artistaMini}>
                {cancionActual.artista}
              </Text>
            </View>

            <Pressable
              style={styles.botonPlayPause}
              onPress={alternarReproduccion}
            >
              <Text style={styles.textoPlayPause}>
                {sonando ? 'Ⅱ' : '▶'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0d0514',
    paddingTop: 50,
  },
  encabezado: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  tituloHeader: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitulo: {
    color: '#b8a7c9',
    fontSize: 15,
    marginBottom: 18,
  },
  contenedorBusqueda: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1025',
    color: '#ffffff',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  botonBuscar: {
    backgroundColor: '#A259FF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconoBuscar: {
    color: '#ffffff',
    fontSize: 30,
  },
  tituloSeccion: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 12,
    marginBottom: 15,
  },
  lista: {
    flex: 1,
  },
  contenidoLista: {
    paddingBottom: 120,
  },
  zonaCentrada: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  textoVacio: {
    color: '#aaa',
    fontSize: 16,
  },
  tarjetaCancion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#1a1025',
    padding: 10,
    borderRadius: 10,
  },
  portada: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#30203e',
  },
  infoCancion: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
    justifyContent: 'center',
  },
  tituloCancion: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artistaCancion: {
    color: '#888',
    fontSize: 14,
  },
  iconoPlay: {
    color: '#A259FF',
    fontSize: 20,
    paddingHorizontal: 5,
  },
  contenedorEcualizador: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 24,
    width: 24,
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  barraEcualizador: {
    width: 4,
    backgroundColor: '#A259FF',
    borderRadius: 2,
  },
  miniReproductor: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: '#A259FF',
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  interiorMiniReproductor: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  portadaMini: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#7b36c7',
  },
  infoMini: {
    flex: 1,
    marginLeft: 12,
  },
  tituloMini: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  artistaMini: {
    color: '#e0c3ff',
    fontSize: 13,
  },
  botonPlayPause: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textoPlayPause: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: 'bold',
  },
});
