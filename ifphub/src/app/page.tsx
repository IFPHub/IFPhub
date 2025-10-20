import { createClient } from './backend/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient(); // Cliente SSR

  // Consultar todos los usuarios
  const { data: usuarios, error } = await supabase
    .from('usuarios')
    .select('email, username, nombre, apellido');

  if (error) {
    console.error(error);
    return <div>Error al cargar los usuarios</div>;
  }

  return (
    <html>
      <body>
        <h1>Lista de usuarios</h1>
        <h1>hola cayeyemito</h1>
        <ul>
          {usuarios?.map((user) => (
            <li key={user.email}>
              <strong>{user.username}</strong> ({user.nombre} {user.apellido}) - {user.email}
            </li>
          ))}
        </ul>
      </body>
    </html>
  );
}
