# 📅 Configuración de Tabla Appointments en Supabase

## 🗄️ Crear Tabla de Citas

Ejecuta este SQL en el **SQL Editor** de Supabase:

```sql
-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_name VARCHAR(255) NOT NULL,
    patient_email VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    service VARCHAR(50) NOT NULL CHECK (service IN ('BRACKETS', 'PROTESIS', 'ENDODONCIAS', 'IMPLANTES')),
    appointment_date DATE NOT NULL,  -- Usar tipo DATE para fechas
    appointment_time TIME NOT NULL,  -- Usar tipo TIME para horas
    status VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE' CHECK (status IN ('PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_patient_email ON appointments(patient_email);

-- Insertar datos de ejemplo
INSERT INTO appointments (patient_name, patient_email, patient_phone, service, appointment_date, appointment_time, status, notes) VALUES
('Juan Pérez', 'juan.perez@email.com', '+52 55 1234 5678', 'BRACKETS', '2025-09-04', '10:00:00', 'CONFIRMADA', 'Primera consulta para brackets'),
('María García', 'maria.garcia@email.com', '+52 55 2345 6789', 'PROTESIS', '2025-09-05', '12:00:00', 'PENDIENTE', 'Consulta para prótesis dental'),
('Carlos López', 'carlos.lopez@email.com', '+52 55 3456 7890', 'ENDODONCIAS', '2025-09-07', '14:00:00', 'CONFIRMADA', 'Tratamiento de conducto'),
('Ana Martínez', 'ana.martinez@email.com', '+52 55 4567 8901', 'IMPLANTES', '2025-09-08', '16:00:00', 'PENDIENTE', 'Evaluación para implante'),
('Roberto Silva', 'roberto.silva@email.com', '+52 55 5678 9012', 'BRACKETS', '2025-09-09', '09:00:00', 'COMPLETADA', 'Seguimiento de brackets');
```

## 🔐 Configurar Políticas de Seguridad (RLS)

```sql
-- Habilitar RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Política para leer citas (todos pueden leer)
CREATE POLICY "Anyone can read appointments" ON appointments
    FOR SELECT USING (true);

-- Política para insertar citas (todos pueden insertar)
CREATE POLICY "Anyone can insert appointments" ON appointments
    FOR INSERT WITH CHECK (true);

-- Política para actualizar citas (todos pueden actualizar)
CREATE POLICY "Anyone can update appointments" ON appointments
    FOR UPDATE USING (true);

-- Política para eliminar citas (todos pueden eliminar)
CREATE POLICY "Anyone can delete appointments" ON appointments
    FOR DELETE USING (true);
```

## 🔧 Verificar Configuración

Después de ejecutar el SQL, verifica que:

1. **La tabla existe** en el Table Editor de Supabase
2. **Los datos de ejemplo** se insertaron correctamente
3. **Las políticas RLS** están activas
4. **Los tipos de datos** son correctos:
   - `appointment_date`: DATE (formato YYYY-MM-DD)
   - `appointment_time`: TIME (formato HH:MM:SS)

## 🐛 Solución de Problemas

### Error: "Invalid date format"
- Asegúrate de que `appointment_date` es de tipo DATE
- Verifica que las fechas se envían en formato YYYY-MM-DD

### Error: "Invalid time format"
- Asegúrate de que `appointment_time` es de tipo TIME
- Verifica que las horas se envían en formato HH:MM:SS

### Las fechas no coinciden
- Verifica que el campo `appointment_date` es de tipo DATE, no TIMESTAMP
- Los tipos DATE no tienen problemas de zona horaria

## ✅ Verificación Final

1. **Crear una cita** desde el formulario
2. **Verificar en Supabase** que la fecha se guarda correctamente
3. **Verificar en el dashboard** que la fecha se muestra igual
4. **Verificar en el calendario** que los puntos aparecen en la fecha correcta
