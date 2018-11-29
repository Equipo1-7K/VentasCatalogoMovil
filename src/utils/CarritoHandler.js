import { AsyncStorage } from "react-native";

/**
 * Clase para manejo de carrito de manera global mediante el AsyncStorage
 * @class
 */
export default class CarritoHandler {
  /**
   * @function vaciar
   * @access public
   * @description Se setea variable carrito del AsyncStorage como array vacío.
   */
  vaciar = () => {
    return new Promise((res, rej) => {
      AsyncStorage.setItem('carrito', JSON.stringify([]), (err) => {
        if (err)
          rej(err);
        else
          res();
      });
    })
  }

  eliminarProducto = (idProducto) => {
    return new Promise((res, rej) => {
      this.obtenerProductos().then((productos) =>{
        const productosLimpio = productos.filter(({id}) => id != idProducto);
        AsyncStorage.setItem('carrito', JSON.stringify(productosLimpio), (err) => {
          if (err)
            rej();
          else
            res();
        });
      }).catch(() => {
        rej();          
      })
    })
  }

  /**
   * @function vaciar
   * @access public
   * @description Se obtiene variable carrito del AsyncStorage.
   * @returns {Promise} Promesa con array de productos contenidos en variable carrito del AsyncStorage.
   */
  obtenerProductos = () => {
    return new Promise((res, rej) => {
      AsyncStorage.getItem('carrito', (err, carrito) => {
        //Se convierte string a objeto (en este caso devuelve un array de objetos)
        const productos = JSON.parse(carrito);
        if (productos && productos.length)
          res(productos);
        else
          rej([]);
      });
    })
  }

  /**
   * @function obtenerProducto
   * @access public
   * @param {number} idProducto - Id del producto que se desea obtener
   * @description Se filtra array de productos para obtener producto buscado por id.
   * @returns {Promise} Promesa con objeto de producto buscado o booleano false cuando no se encuentra.
   */
  obtenerProducto = (idProducto) => {
    return new Promise((res, rej) => {
      this.obtenerProductos().then((productos) =>{
        const productoBuscado = productos.filter(({id}) => {
          return id == idProducto
        })[0];
        if (productoBuscado) 
          res(productoBuscado);
        else
          rej(false);
      })
    });
  }

  /**
   * @function obtenerTotal
   * @access public
   * @description Se recorre array de productos para realizar sumatoria de subtotales.
   * @returns {Promise} Promesa con el total a pagar de la venta.
   */
  obtenerTotal = () => {
    return new Promise((res, rej) => {
      this.obtenerProductos().then((productos) =>{
        res(this._objetoCalcularTotal(productos, 'subtotal'));
      }).catch(() => {
        rej(0);          
      })
    });
  }

  /**
   * @function _objetoCalcularTotal
   * @access private
   * @param {Array} arrayObjetos - Array de objetos para realizar sumatoria
   * @param {string} propiedad - Nombre de propiedad para realizar sumatoria
   * @description Se recorre array de objetos para realizar sumatoria de propiedad establecida.
   * @returns {number} Resultado de sumatoria.
   */
  _objetoCalcularTotal = (arrayObjetos, propiedad) => {
    let subtotal = arrayObjetos.map((objeto) => {
      return objeto[propiedad];
    });
    let total = subtotal.reduce((prev, current) => parseFloat(prev) + parseFloat(current), 0);
      return total;
  }

  /**
   * @function agregarProducto
   * @access public
   * @param {Object} producto - Objeto de producto para agregar al carrito
   * @param {number} [cantidad] - Cantidad de producto a agregar
   * @description Se agrega propiedad 'cantidad' a objeto de producto. Se verifica si existen productos en carrito para inicializar array o agregarlo al array existente.
   */
  agregarProducto = (producto, cantidad = 1) => {
    return new Promise((res, rej) => {
      const subtotal = (producto.precio * cantidad);
      const nuevoProducto = {...producto, cantidad, subtotal};
      this.obtenerProductos().then((productos) => {
        this._agregarProducto(productos, nuevoProducto).then(() => {
          res('El producto se agregó al carrito');
        })
        .catch(() => {
          rej('El producto no se pudo agregar al carrito');
        });
      }).catch(()=>{
        this._agregarPrimerProducto(nuevoProducto).then(() => {
          res('El producto se agregó al carrito');
        })
        .catch(() => {
          rej('El producto no se pudo agregar al carrito');
        });
      })
    })
  }

  /**
   * @function _agregarProducto
   * @access private
   * @param {Array} productos - Array de productos del carrito
   * @param {Object} nuevoProducto - Objeto de producto para agregar al carrito
   * @description Se filtra array de productos para excluir producto con id del nuevoProducto y evitar productos repetidos. 
   * Se crea array nuevo concatenando el nuevoProducto con el array de productos y se convierte a string para agregarlo al AsyncStorage.
   */
  _agregarProducto = (productos, nuevoProducto) => {
    return new Promise((res, rej) => {
      const productosLimpio = productos.filter(({id}) => id != nuevoProducto.id);
      const nuevoProductos = [...productosLimpio, nuevoProducto];
      AsyncStorage.setItem('carrito', JSON.stringify(nuevoProductos), (err) => {
        if (err)
          rej();
        else
          res();
      });
    })
  }

  /**
   * @function _agregarPrimerProducto
   * @access private
   * @param {Object} nuevoProducto - Objeto de producto para agregar al carrito
   * @description Se crea array de productos con nuevoProducto y se convierte a string para agregarlo al AsyncStorage.
   */
  _agregarPrimerProducto = (nuevoProducto) => {
    return new Promise((res, rej) => {
      const nuevoProductos = [nuevoProducto];
      AsyncStorage.setItem('carrito', JSON.stringify(nuevoProductos), (err) => {
        if (err)
          rej();
        else
          res();
      });
    });
  }
}