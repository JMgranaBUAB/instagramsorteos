# InstagramSorteos 🎉

Una aplicación web moderna para extraer y visualizar publicaciones de Instagram con hashtags específicos, especialmente enfocada en sorteos y concursos.

## ✨ Características

- 🔍 **Búsqueda por hashtags** - Encuentra publicaciones específicas de Instagram
- 📱 **Interfaz moderna** - Diseño responsive con Tailwind CSS
- 💾 **Almacenamiento inteligente** - Cache local con auto-limpieza
- 🔄 **Múltiples fuentes de datos** - Sistema de fallback entre APIs
- ⚡ **Acceso offline** - Funciona sin conexión usando datos almacenados
- 📊 **Estadísticas** - Visualiza métricas de uso y almacenamiento

## 🚀 Fuentes de Datos Disponibles

### 1. Instagram Graph API (Recomendado)
- ✅ Datos oficiales de Meta/Facebook
- ✅ Más confiable y estable
- ❌ Requiere cuenta comercial de Instagram
- ❌ Proceso de aprobación

### 2. APIs de Terceros (RapidAPI)
- ✅ Configuración rápida
- ✅ Datos reales actualizados
- ❌ Costo por uso
- ❌ Limitaciones de rate limit

### 3. Backend Proxy
- ✅ Control total sobre los datos
- ✅ Sin limitaciones de CORS
- ❌ Requiere servidor backend
- ❌ Más complejo de mantener

### 4. Datos Mock (Fallback)
- ✅ Siempre disponible
- ✅ Perfecto para desarrollo
- ❌ No son datos reales

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/instagramsorteos.git

# Navegar al directorio
cd instagramsorteos

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servidor de desarrollo
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Instagram Graph API (Más confiable)
VITE_INSTAGRAM_ACCESS_TOKEN=tu_access_token_aqui
VITE_INSTAGRAM_BUSINESS_ACCOUNT_ID=tu_business_account_id_aqui

# RapidAPI (Alternativa rápida)
VITE_RAPIDAPI_KEY=tu_rapidapi_key_aqui

# Backend Proxy (Control total)
VITE_BACKEND_URL=http://localhost:3001

# Apify (Para scraping)
VITE_APIFY_TOKEN=tu_apify_token_aqui

# Supabase (Base de datos)
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_key
```

### Configuración de Instagram Graph API

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una nueva aplicación
3. Agrega el producto "Instagram Basic Display"
4. Configura tu cuenta comercial de Instagram
5. Obtén tu Access Token y Business Account ID

### Configuración de RapidAPI

1. Regístrate en [RapidAPI](https://rapidapi.com/)
2. Busca "Instagram API" o similar
3. Suscríbete a un plan
4. Copia tu API key

## 🏗️ Arquitectura

```
src/
├── components/           # Componentes React
│   ├── SearchBar.tsx    # Barra de búsqueda
│   ├── PostCard.tsx     # Tarjeta de publicación
│   ├── LoadingSpinner.tsx
│   ├── EmptyState.tsx
│   ├── StatsBar.tsx
│   └── StorageStats.tsx
├── services/            # Servicios de datos
│   ├── instagramService.ts      # Servicio principal
│   ├── instagramGraphAPI.ts     # API oficial
│   ├── thirdPartyAPIs.ts        # APIs de terceros
│   ├── backendProxyService.ts   # Proxy personalizado
│   └── localStorageService.ts   # Almacenamiento local
├── data/
│   └── mockData.ts      # Datos de prueba
└── lib/
    └── supabase.ts      # Cliente Supabase
```

## 🔧 Tecnologías

- **Frontend**: React + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Base de datos**: Supabase
- **Almacenamiento**: LocalStorage API
- **APIs**: Instagram Graph API, RapidAPI, Apify

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 🔄 Sistema de Fallback

La aplicación utiliza un sistema inteligente de fallback:

1. **Cache local** (si está disponible y es reciente)
2. **Instagram Graph API** (si está configurado)
3. **Backend Proxy** (si está disponible)
4. **APIs de terceros** (RapidAPI, etc.)
5. **Datos mock** (siempre como último recurso)

## 📱 Uso

1. **Buscar hashtags**: Ingresa un hashtag (ej: "sorteo", "giveaway")
2. **Ver resultados**: Explora las publicaciones encontradas
3. **Acceder a publicaciones**: Click en el ícono de enlace externo
4. **Historial**: Ve tus búsquedas recientes en las estadísticas
5. **Cache**: Los datos se guardan automáticamente para acceso offline

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit de los cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## ⚠️ Consideraciones Legales

- Respeta los términos de servicio de Instagram
- No hagas scraping agresivo
- Considera implementar rate limiting
- Informa a los usuarios sobre el uso de datos

## 🐛 Problemas Conocidos

- Las APIs públicas de Instagram pueden cambiar sin previo aviso
- Algunas funciones requieren autenticación con Instagram
- Los datos mock no reflejan contenido real

## 📞 Soporte

Si encuentras problemas o tienes preguntas:
- Abre un [issue](https://github.com/tu-usuario/instagramsorteos/issues)
- Revisa la documentación de las APIs utilizadas
- Verifica tu configuración de variables de entorno

---

Desarrollado con ❤️ para la comunidad de desarrolladores