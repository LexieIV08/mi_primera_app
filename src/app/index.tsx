import * as Location from 'expo-location';
import { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// ======================================================
// SECCIÓN 1. INTERFACES Y TIPOS DE DATOS
// Definen la estructura de las ciudades y de las APIs.
// ======================================================

type Ciudad = {
  nombre: string;
  lat: number | null;
  lon: number | null;
};

type DatosClima = {
  temperatura: number;
  sensacion: number;
  humedad: number;
  viento: number;
  codigoClima: number;
  esDeDia: number;
  maxima: number;
  minima: number;
  uv: number;
};

type DatosAire = {
  aqi: number | null;
  pm25: number | null;
  pm10: number | null;
};

// ======================================================
// SECCIÓN 2. LISTA DE CIUDADES
// Cada ciudad tiene su nombre y coordenadas geográficas.
// ======================================================

const CIUDADES_PRUEBA: Ciudad[] = [
  { nombre: 'Local (GPS)', lat: null, lon: null },
  { nombre: 'Tokio 🇯🇵', lat: 35.6762, lon: 139.6503 },
  { nombre: 'Bangkok 🇹🇭', lat: 13.7563, lon: 100.5018 },
  { nombre: 'Lisboa 🇵🇹', lat: 38.7223, lon: -9.1393 },
  { nombre: 'Ciudad de México 🇲🇽', lat: 19.4326, lon: -99.1332 },
  { nombre: 'Barcelona 🇪🇸', lat: 41.3874, lon: 2.1686 },
  { nombre: 'Seúl 🇰🇷', lat: 37.5665, lon: 126.9780 },
  { nombre: 'Praga 🇨🇿', lat: 50.0755, lon: 14.4378 },
  { nombre: 'Buenos Aires 🇦🇷', lat: -34.6037, lon: -58.3816 },
  { nombre: 'Roma 🇮🇹', lat: 41.9028, lon: 12.4964 },
  { nombre: 'Medellín 🇨🇴', lat: 6.2476, lon: -75.5636 },
];

// ======================================================
// SECCIÓN 3. FUNCIONES AUXILIARES
// Traducen los códigos meteorológicos a descripciones
// e iconos para mostrar el estado del clima.
// ======================================================

function obtenerDescripcionClima(codigo: number): string {
  if (codigo === 0) return 'Cielo despejado';
  if ([1, 2].includes(codigo)) return 'Poco nublado';
  if (codigo === 3) return 'Cielo nublado';
  if ([45, 48].includes(codigo)) return 'Niebla';
  if ([51, 53, 55, 56, 57].includes(codigo)) return 'Llovizna';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) {
    return 'Lluvia';
  }
  if ([71, 73, 75, 77, 85, 86].includes(codigo)) return 'Nieve';
  if ([95, 96, 99].includes(codigo)) return 'Tormenta eléctrica';
  return 'Condiciones variables';
}

function obtenerIconoClima(codigo: number, esDeDia: number): string {
  if (codigo === 0) return esDeDia ? '☀️' : '🌙';
  if ([1, 2].includes(codigo)) return esDeDia ? '🌤️' : '☁️';
  if (codigo === 3) return '☁️';
  if ([45, 48].includes(codigo)) return '🌫️';
  if ([51, 53, 55, 56, 57].includes(codigo)) return '🌦️';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) return '🌧️';
  if ([71, 73, 75, 77, 85, 86].includes(codigo)) return '❄️';
  if ([95, 96, 99].includes(codigo)) return '⛈️';
  return '🌡️';
}

function obtenerCategoriaAire(aqi: number | null): string {
  if (aqi === null) return 'Sin datos';
  if (aqi <= 50) return 'Buena';
  if (aqi <= 100) return 'Moderada';
  if (aqi <= 150) return 'Dañina para grupos sensibles';
  if (aqi <= 200) return 'Dañina';
  if (aqi <= 300) return 'Muy dañina';
  return 'Peligrosa';
}

// ======================================================
// SECCIÓN 4. COMPONENTE PRINCIPAL
// Aquí se guardan los datos y se controla la pantalla.
// ======================================================

export default function Index() {
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('Local (GPS)');
  const [nombreLugar, setNombreLugar] = useState('Tu ubicación');
  const [clima, setClima] = useState<DatosClima | null>(null);
  const [aire, setAire] = useState<DatosAire | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // ====================================================
  // SECCIÓN 5. CONSULTA DE LAS APIs
  // Consulta el clima y la calidad del aire mediante
  // Open-Meteo usando las coordenadas de la ciudad.
  // ====================================================

  async function obtenerDatos(
    latPrueba: number | null = null,
    lonPrueba: number | null = null,
    nombrePrueba: string | null = null
  ) {
    setCargando(true);
    setError('');

    try {
      let lat = latPrueba;
      let lon = lonPrueba;
      let nombre = nombrePrueba ?? 'Tu ubicación';

      // Si no se enviaron coordenadas, solicita el GPS.
      if (lat === null || lon === null) {
        const permiso = await Location.requestForegroundPermissionsAsync();

        if (permiso.status !== 'granted') {
          throw new Error(
            'No se concedió permiso para acceder a la ubicación. Selecciona una ciudad de la lista.'
          );
        }

        const ubicacion = await Location.getCurrentPositionAsync({});
        lat = ubicacion.coords.latitude;
        lon = ubicacion.coords.longitude;
        nombre = 'Tu ubicación actual';
      }

      // Solicitud de datos meteorológicos.
      const urlClima =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}` +
        `&longitude=${lon}` +
        '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m' +
        '&daily=temperature_2m_max,temperature_2m_min,uv_index_max' +
        '&timezone=auto';

      // Solicitud de datos sobre calidad del aire.
      const urlAire =
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}` +
        `&longitude=${lon}` +
        '&current=us_aqi,pm2_5,pm10' +
        '&timezone=auto';

      const [respuestaClima, respuestaAire] = await Promise.all([
        fetch(urlClima),
        fetch(urlAire),
      ]);

      if (!respuestaClima.ok) {
        throw new Error('No fue posible consultar el clima.');
      }

      const datosClima = await respuestaClima.json();
      const datosAire = respuestaAire.ok
        ? await respuestaAire.json()
        : null;

      // Guarda la información meteorológica recibida.
      setClima({
        temperatura: datosClima.current.temperature_2m,
        sensacion: datosClima.current.apparent_temperature,
        humedad: datosClima.current.relative_humidity_2m,
        viento: datosClima.current.wind_speed_10m,
        codigoClima: datosClima.current.weather_code,
        esDeDia: datosClima.current.is_day,
        maxima: datosClima.daily.temperature_2m_max[0],
        minima: datosClima.daily.temperature_2m_min[0],
        uv: datosClima.daily.uv_index_max[0],
      });

      // Guarda la información sobre la calidad del aire.
      setAire(
        datosAire?.current
          ? {
              aqi: datosAire.current.us_aqi ?? null,
              pm25: datosAire.current.pm2_5 ?? null,
              pm10: datosAire.current.pm10 ?? null,
            }
          : { aqi: null, pm25: null, pm10: null }
      );

      setNombreLugar(nombre);
    } catch (err) {
      const mensaje =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al consultar los datos.';

      setError(mensaje);
      setClima(null);
      setAire(null);
    } finally {
      setCargando(false);
    }
  }

  // ====================================================
  // SECCIÓN 6. SELECCIÓN DE CIUDADES
  // Al tocar una ciudad, consulta el clima de sus
  // coordenadas y actualiza la información en pantalla.
  // ====================================================

  function seleccionarCiudad(ciudad: Ciudad) {
    setCiudadSeleccionada(ciudad.nombre);

    if (ciudad.lat === null || ciudad.lon === null) {
      obtenerDatos(null, null, null);
    } else {
      obtenerDatos(ciudad.lat, ciudad.lon, ciudad.nombre);
    }
  }

  // ====================================================
  // SECCIÓN 7. INTERFAZ VISUAL
  // Muestra el selector, el clima y la calidad del aire.
  // ====================================================

  return (
    <SafeAreaView style={estilos.contenedor}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7FB" />

      <ScrollView contentContainerStyle={estilos.contenido}>
        {/* Encabezado de la aplicación */}
        <Text style={estilos.etiqueta}>GUÍA DE VIAJES</Text>
        <Text style={estilos.titulo}>Ciudades para tus 20s</Text>
        <Text style={estilos.subtitulo}>
          Explora diez destinos y consulta su clima antes de viajar.
        </Text>

        {/* Selector horizontal de ciudades */}
        <Text style={estilos.tituloSeccion}>Elige tu destino</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.listaCiudades}
        >
          {CIUDADES_PRUEBA.map((ciudad) => {
            const seleccionada = ciudadSeleccionada === ciudad.nombre;

            return (
              <TouchableOpacity
                key={ciudad.nombre}
                style={[
                  estilos.botonCiudad,
                  seleccionada && estilos.botonCiudadActivo,
                ]}
                onPress={() => seleccionarCiudad(ciudad)}
                accessibilityRole="button"
                accessibilityLabel={`Consultar clima de ${ciudad.nombre}`}
              >
                <Text
                  style={[
                    estilos.textoBotonCiudad,
                    seleccionada && estilos.textoBotonCiudadActivo,
                  ]}
                >
                  {ciudad.nombre}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Estado inicial y botón para obtener el clima local */}
        {!clima && !cargando && !error && (
          <View style={estilos.tarjetaBienvenida}>
            <Text style={estilos.iconoBienvenida}>🌍</Text>
            <Text style={estilos.tituloTarjeta}>¿A dónde quieres ir?</Text>
            <Text style={estilos.textoSecundario}>
              Selecciona una ciudad para consultar su clima actual.
            </Text>

            <TouchableOpacity
              style={estilos.botonPrincipal}
              onPress={() => seleccionarCiudad(CIUDADES_PRUEBA[0])}
            >
              <Text style={estilos.textoBotonPrincipal}>
                Consultar mi ubicación
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Indicador de carga mientras responden las APIs */}
        {cargando && (
          <View style={estilos.tarjetaCarga}>
            <ActivityIndicator size="large" color="#4169E1" />
            <Text style={estilos.textoCarga}>Consultando información...</Text>
          </View>
        )}

        {/* Mensaje de error y opción para volver a intentarlo */}
        {!!error && !cargando && (
          <View style={estilos.tarjetaError}>
            <Text style={estilos.iconoError}>⚠️</Text>
            <Text style={estilos.tituloTarjeta}>No se pudo cargar</Text>
            <Text style={estilos.textoSecundario}>{error}</Text>

            <TouchableOpacity
              style={estilos.botonPrincipal}
              onPress={() => {
                const ciudad = CIUDADES_PRUEBA.find(
                  (item) => item.nombre === ciudadSeleccionada
                );

                if (ciudad) seleccionarCiudad(ciudad);
              }}
            >
              <Text style={estilos.textoBotonPrincipal}>Intentar de nuevo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tarjeta principal con la temperatura y el estado del clima */}
        {clima && !cargando && (
          <>
            <View style={estilos.tarjetaClima}>
              <Text style={estilos.textoUbicacion}>DESTINO SELECCIONADO</Text>
              <Text style={estilos.nombreCiudad}>{nombreLugar}</Text>

              <Text style={estilos.iconoClima}>
                {obtenerIconoClima(clima.codigoClima, clima.esDeDia)}
              </Text>

              <Text style={estilos.temperatura}>
                {Math.round(clima.temperatura)}°
              </Text>

              <Text style={estilos.descripcionClima}>
                {obtenerDescripcionClima(clima.codigoClima)}
              </Text>

              <Text style={estilos.sensacion}>
                Sensación térmica: {Math.round(clima.sensacion)}°C
              </Text>

              <View style={estilos.divisor} />

              {/* Temperaturas máximas y mínimas del día */}
              <View style={estilos.filaTemperaturas}>
                <View style={estilos.datoTemperatura}>
                  <Text style={estilos.iconoDato}>🌡️</Text>
                  <Text style={estilos.etiquetaDato}>Máxima</Text>
                  <Text style={estilos.valorDato}>
                    {Math.round(clima.maxima)}°C
                  </Text>
                </View>

                <View style={estilos.datoTemperatura}>
                  <Text style={estilos.iconoDato}>❄️</Text>
                  <Text style={estilos.etiquetaDato}>Mínima</Text>
                  <Text style={estilos.valorDato}>
                    {Math.round(clima.minima)}°C
                  </Text>
                </View>
              </View>
            </View>

            {/* Tarjetas de humedad, viento e índice UV */}
            <Text style={estilos.tituloSeccion}>Detalles del clima</Text>

            <View style={estilos.grilla}>
              <View style={estilos.tarjetaDato}>
                <Text style={estilos.iconoDato}>💧</Text>
                <Text style={estilos.etiquetaDato}>Humedad</Text>
                <Text style={estilos.valorDato}>{clima.humedad}%</Text>
              </View>

              <View style={estilos.tarjetaDato}>
                <Text style={estilos.iconoDato}>💨</Text>
                <Text style={estilos.etiquetaDato}>Viento</Text>
                <Text style={estilos.valorDato}>
                  {Math.round(clima.viento)} km/h
                </Text>
              </View>

              <View style={estilos.tarjetaDato}>
                <Text style={estilos.iconoDato}>☀️</Text>
                <Text style={estilos.etiquetaDato}>Índice UV máx.</Text>
                <Text style={estilos.valorDato}>
                  {clima.uv.toFixed(1)}
                </Text>
              </View>
            </View>

            {/* Calidad del aire consultada desde Open-Meteo */}
            <Text style={estilos.tituloSeccion}>Calidad del aire</Text>

            <View style={estilos.tarjetaAire}>
              <Text style={estilos.iconoAire}>🌿</Text>
              <View style={estilos.contenidoAire}>
                <Text style={estilos.tituloAire}>
                  {obtenerCategoriaAire(aire?.aqi ?? null)}
                </Text>
                <Text style={estilos.textoSecundario}>
                  Índice de calidad del aire de Estados Unidos (US AQI)
                </Text>

                <View style={estilos.filaAire}>
                  <Text style={estilos.etiquetaDato}>US AQI</Text>
                  <Text style={estilos.valorDato}>
                    {aire?.aqi ?? 'N/D'}
                  </Text>
                </View>

                <View style={estilos.filaAire}>
                  <Text style={estilos.etiquetaDato}>PM2.5</Text>
                  <Text style={estilos.valorDato}>
                    {aire?.pm25 != null
                      ? `${aire.pm25.toFixed(1)} µg/m³`
                      : 'N/D'}
                  </Text>
                </View>

                <View style={estilos.filaAire}>
                  <Text style={estilos.etiquetaDato}>PM10</Text>
                  <Text style={estilos.valorDato}>
                    {aire?.pm10 != null
                      ? `${aire.pm10.toFixed(1)} µg/m³`
                      : 'N/D'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Nota informativa sobre los datos */}
            <Text style={estilos.nota}>
              Datos meteorológicos y de calidad del aire proporcionados por
              Open-Meteo. Las condiciones pueden cambiar durante el día.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// SECCIÓN 8. ESTILOS
// Controla los colores, tamaños, márgenes y tarjetas
// de la interfaz de usuario.
// ======================================================

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  contenido: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36,
  },
  etiqueta: {
    color: '#4169E1',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  titulo: {
    color: '#17233D',
    fontSize: 29,
    fontWeight: '800',
    lineHeight: 35,
  },
  subtitulo: {
    color: '#68758A',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 24,
  },
  tituloSeccion: {
    color: '#17233D',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 18,
    marginBottom: 12,
  },
  listaCiudades: {
    paddingBottom: 8,
    paddingRight: 8,
  },
  botonCiudad: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE4F0',
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 11,
    marginRight: 9,
    marginBottom: 8,
  },
  botonCiudadActivo: {
    backgroundColor: '#4169E1',
    borderColor: '#4169E1',
  },
  textoBotonCiudad: {
    color: '#39465D',
    fontSize: 13,
    fontWeight: '700',
  },
  textoBotonCiudadActivo: {
    color: '#FFFFFF',
  },
  tarjetaBienvenida: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    marginTop: 22,
    elevation: 2,
  },
  iconoBienvenida: {
    fontSize: 50,
    marginBottom: 12,
  },
  tituloTarjeta: {
    color: '#17233D',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  textoSecundario: {
    color: '#68758A',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  botonPrincipal: {
    backgroundColor: '#4169E1',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginTop: 20,
  },
  textoBotonPrincipal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  tarjetaCarga: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 35,
    alignItems: 'center',
    marginTop: 22,
  },
  textoCarga: {
    color: '#68758A',
    marginTop: 14,
    fontSize: 14,
  },
  tarjetaError: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginTop: 22,
    borderColor: '#F3C5C5',
    borderWidth: 1,
  },
  iconoError: {
    fontSize: 35,
    marginBottom: 10,
  },
  tarjetaClima: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
  },
  textoUbicacion: {
    color: '#7A879B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  nombreCiudad: {
    color: '#17233D',
    fontSize: 21,
    fontWeight: '800',
    marginTop: 8,
    textAlign: 'center',
  },
  iconoClima: {
    fontSize: 62,
    marginTop: 12,
  },
  temperatura: {
    color: '#17233D',
    fontSize: 62,
    fontWeight: '300',
    lineHeight: 70,
  },
  descripcionClima: {
    color: '#39465D',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 4,
  },
  sensacion: {
    color: '#68758A',
    fontSize: 13,
    marginTop: 7,
  },
  divisor: {
    height: 1,
    backgroundColor: '#E8EDF5',
    width: '100%',
    marginVertical: 20,
  },
  filaTemperaturas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  datoTemperatura: {
    alignItems: 'center',
    flex: 1,
  },
  iconoDato: {
    fontSize: 25,
    marginBottom: 7,
  },
  etiquetaDato: {
    color: '#7A879B',
    fontSize: 12,
    marginBottom: 5,
  },
  valorDato: {
    color: '#17233D',
    fontSize: 17,
    fontWeight: '800',
  },
  grilla: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tarjetaDato: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    width: '31.5%',
    elevation: 1,
  },
  tarjetaAire: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 1,
  },
  iconoAire: {
    fontSize: 32,
    marginRight: 14,
    marginTop: 2,
  },
  contenidoAire: {
    flex: 1,
  },
  tituloAire: {
    color: '#17233D',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 5,
  },
  filaAire: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#E8EDF5',
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 10,
  },
  nota: {
    color: '#8490A3',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 22,
    paddingHorizontal: 8,
  },
});