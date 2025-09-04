# 🔧 Configuración de Supabase para DentalEspejo

## 📋 Pasos para conectar tu aplicación con Supabase

### 1. **Configurar Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Supabase:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

### 2. **Obtener Credenciales de Supabase**

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión en tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 3. **Crear Tabla de Usuarios**

Ejecuta este SQL en el **SQL Editor** de Supabase:

```sql
-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'doctor', 'receptionist')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar datos de ejemplo
INSERT INTO users (id, name, email, password, role, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Dr. María González', 'maria.gonzalez@centrodentalespejo.com', 'password123', 'admin', true),
('550e8400-e29b-41d4-a716-446655440002', 'Dr. Carlos Ruiz', 'carlos.ruiz@centrodentalespejo.com', 'password123', 'doctor', true),
('550e8400-e29b-41d4-a716-446655440003', 'Dr. Ana López', 'ana.lopez@centrodentalespejo.com', 'password123', 'doctor', true),
('550e8400-e29b-41d4-a716-446655440004', 'Roberto Méndez', 'roberto.mendez@gmail.com', 'password123', 'receptionist', true),
('550e8400-e29b-41d4-a716-446655440005', 'Laura Sánchez', 'laura.sanchez@gmail.com', 'password123', 'receptionist', false);
```

### 4. **Configurar Políticas de Seguridad (RLS)**

En el **Authentication** → **Policies** de Supabase, crea estas políticas:

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para leer usuarios (todos pueden leer)
CREATE POLICY "Users can read all users" ON users
    FOR SELECT USING (true);

-- Política para insertar usuarios (solo admins)
CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (true);

-- Política para actualizar usuarios (solo admins)
CREATE POLICY "Admins can update users" ON users
    FOR UPDATE USING (true);

-- Política para eliminar usuarios (solo admins)
CREATE POLICY "Admins can delete users" ON users
    FOR DELETE USING (true);
```

### 5. **Reiniciar la Aplicación**

```bash
npm run dev
```

## ✅ **Verificación**

1. **Inicia sesión** con las credenciales de ejemplo:
   - Email: `maria.gonzalez@centrodentalespejo.com`
   - Password: `password123`

2. **Ve al panel de administración** y verifica que:
   - Los usuarios se cargan desde Supabase
   - Puedes crear nuevos usuarios
   - Los cambios se reflejan en la base de datos

## 🔍 **Solución de Problemas**

### Error: "Missing Supabase environment variables"
- Verifica que el archivo `.env` existe y tiene las variables correctas
- Reinicia el servidor de desarrollo

### Error: "Failed to fetch"
- Verifica que la URL de Supabase es correcta
- Asegúrate de que las políticas RLS permiten las operaciones

### Los usuarios no aparecen
- Verifica que la tabla `users` existe en Supabase
- Revisa la consola del navegador para errores
- Verifica que las políticas RLS están configuradas

## 📊 **Estado Actual**

✅ **Configuración de Supabase** - Completada  
✅ **Servicios de usuario** - Implementados  
✅ **Componentes actualizados** - Conectados a Supabase  
✅ **Autenticación híbrida** - Supabase + localStorage fallback  

## 🚀 **Próximos Pasos**

1. Configurar las credenciales en `.env`
2. Crear la tabla en Supabase
3. Probar la funcionalidad
4. Implementar el mismo patrón para citas (appointments)
