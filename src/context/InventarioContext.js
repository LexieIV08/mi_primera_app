import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const InventarioContext = createContext();

const CLAVE_INVENTARIO = '@db_productos';

export const InventarioProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [cargado, setCargado] = useState(false);

  // Cargar los productos guardados al abrir la aplicación
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(CLAVE_INVENTARIO);

        if (jsonValue !== null) {
          const datos = JSON.parse(jsonValue);
          if (Array.isArray(datos)) {
            setProductos(datos);
          }
        }
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setCargado(true);
      }
    };

    cargarDatos();
  }, []);

  // Guardar los cambios después de completar la carga inicial
  useEffect(() => {
    if (!cargado) return;

    const guardarDatos = async () => {
      try {
        await AsyncStorage.setItem(
          CLAVE_INVENTARIO,
          JSON.stringify(productos)
        );
      } catch (error) {
        console.error('Error guardando productos:', error);
      }
    };

    guardarDatos();
  }, [productos, cargado]);

  // Registrar un producto nuevo
  const agregarProducto = (nombre, precio, categoria, vendedor) => {
    const nuevo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nombre: nombre.trim(),
      precio: Number(precio),
      categoria,
      vendedor: vendedor.trim(),
    };

    setProductos((actuales) => [...actuales, nuevo]);
  };

  // Actualizar un producto existente
  const actualizarProducto = (
    id,
    nuevoNombre,
    nuevoPrecio,
    nuevaCategoria,
    nuevoVendedor
  ) => {
    setProductos((actuales) =>
      actuales.map((item) =>
        item.id === id
          ? {
              ...item,
              nombre: nuevoNombre.trim(),
              precio: Number(nuevoPrecio),
              categoria: nuevaCategoria,
              vendedor: nuevoVendedor.trim(),
            }
          : item
      )
    );
  };

  // Eliminar un producto
  const eliminarProducto = (id) => {
    setProductos((actuales) =>
      actuales.filter((item) => item.id !== id)
    );
  };

  return (
    <InventarioContext.Provider
      value={{
        productos,
        agregarProducto,
        actualizarProducto,
        eliminarProducto,
      }}
    >
      {children}
    </InventarioContext.Provider>
  );
};