import { createClient } from './backend/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient(); // ✅ await porque es async

  const { data: todos } = await supabase.from('todos').select();

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.title}</li> // agregar key y campo correcto
      ))}
    </ul>
  );
}
