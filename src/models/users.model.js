// Modelo de usuarios
// Este archivo es la CAPA DE DATOS: solo maneja el arreglo
// de usuarios. No sabe nada de HTTP, req ni res.
// El controlador es quien lo llama y envía la respuesta.

// Dos usuarios de prueba para testear el backend sin crear datos desde cero
let users = [
  { id: 1, name: "Karol Torres",     email: "karoln.oficiall@gmail.com",   document: "1097497124" },
  { id: 2, name: "Sebastian Patiño", email: "sebastian.patinio@gmail.com", document: "1005331719" },
];

// Variable auxiliar para generar ids únicos y crecientes.
// Empieza en 3 porque ya hay 2 usuarios de prueba.
let nextId = 3;

// getAllUsers — Retorna todos los usuarios del arreglo.
const getAllUsers = () => {
  return users;
};

// getUserById — Busca y retorna UN usuario según su id.
// Retorna el objeto usuario si existe, o undefined si no lo encuentra.
const getUserById = (id) => {
  // .find() recorre el arreglo y devuelve el primer elemento
  // cuyo campo 'id' coincida con el parámetro recibido.
  return users.find((user) => user.id === id);
};

// createUser — Crea un nuevo usuario y lo agrega al arreglo.
// Parámetro: userData (objeto) — debe tener { name, email, document }.
const createUser = (userData) => {
  const newUser = {
    id: nextId,    // Asignamos el id actual
    ...userData,   // Spread: copia name, email y document del objeto recibido
  };

  nextId++;            // Aumentamos el contador para el próximo usuario
  users.push(newUser); // Agregamos el nuevo usuario al arreglo

  return newUser;
};

// updateUser — Actualiza los datos de un usuario existente.
// Retorna el usuario actualizado, o null si no existe.
const updateUser = (id, userData) => {
  // .findIndex() devuelve la posición en el arreglo, o -1 si no lo encuentra
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return null; // No existe el usuario con ese id
  }

  // Reemplazamos combinando el objeto original con los nuevos datos
  users[index] = {
    ...users[index], // Conserva los campos que no cambian
    ...userData,     // Sobreescribe solo los campos enviados
  };

  return users[index];
};

// deleteUser — Elimina un usuario del arreglo por su id.
// Retorna el usuario eliminado, o null si no existía.
const deleteUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return null;
  }

  // .splice(index, 1) elimina 1 elemento en esa posición
  // y devuelve un arreglo con el elemento eliminado
  const deleted = users.splice(index, 1);

  return deleted[0];
};

// Exportamos todas las funciones para que el controlador las pueda importar
export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};