-- Crear tabla de animes
CREATE TABLE IF NOT EXISTS animes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  image TEXT,
  score DECIMAL(3,1),
  year INTEGER,
  status VARCHAR(50),
  type VARCHAR(20),
  episodes INTEGER,
  genres TEXT[], -- Array de géneros
  synopsis TEXT,
  views INTEGER DEFAULT 0,
  language VARCHAR(20),
  episodes_links JSONB, -- Para almacenar los enlaces de episodios
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_animes_title ON animes USING gin(to_tsvector('spanish', title));
CREATE INDEX IF NOT EXISTS idx_animes_genres ON animes USING gin(genres);
CREATE INDEX IF NOT EXISTS idx_animes_status ON animes(status);
CREATE INDEX IF NOT EXISTS idx_animes_year ON animes(year);
CREATE INDEX IF NOT EXISTS idx_animes_score ON animes(score DESC);
CREATE INDEX IF NOT EXISTS idx_animes_views ON animes(views DESC);
CREATE INDEX IF NOT EXISTS idx_animes_created_at ON animes(created_at DESC);

-- Habilitar Row Level Security
ALTER TABLE animes ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
DROP POLICY IF EXISTS "Allow public read access" ON animes;
CREATE POLICY "Allow public read access" ON animes
FOR SELECT USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_animes_updated_at ON animes;
CREATE TRIGGER update_animes_updated_at 
    BEFORE UPDATE ON animes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
