🎮 PokéApp — Ionic Angular 

📱 Descripción
PokéApp es una aplicación móvil híbrida desarrollada con Ionic 7 y Angular 17 en modo Standalone, que consume la PokéAPI para mostrar información detallada de todos los Pokémon. Incluye autenticación simulada, búsqueda, filtros por tipo, sistema de favoritos persistente y diseño oscuro con temática Pokéball.

✨ Características

🔐 Login con validación — formulario reactivo con credenciales de prueba
🏠 Dashboard de inicio — estadísticas, accesos rápidos y Pokémon destacados
📋 Pokédex completa — lista con scroll infinito y carga de 20 en 20
🔍 Búsqueda en tiempo real — busca por nombre o ID con debounce
🏷️ Filtro por tipo — 18 tipos disponibles (fuego, agua, planta...)
❤️ Sistema de favoritos — guarda y gestiona tus Pokémon favoritos (persistido en localStorage)
📊 Detalle completo — estadísticas, habilidades, movimientos, descripción y más
🌙 Tema oscuro — diseño oscuro con acento rojo/Pokéball
📱 Compatible con Android — mediante Capacitor 5


🖼️ Pantallas
LoginHomePokédexDetalleFavoritosFormulario animado con PokéballDashboard con statsGrid con filtros y búsquedaImagen flotante + tabsLista con mini stats

🛠️ Tecnologías
TecnologíaVersiónUsoIonic7Framework UI mobileAngular17Framework web (Standalone mode)TypeScript5Lenguaje principalCapacitor5Compilación nativa Android/iOSRxJS7Programación reactivaPokéAPIv2API REST de Pokémon

🚀 Instalación y ejecución
Prerequisitos

Node.js v18 o superior
npm v9 o superior
Ionic CLI

bashnpm install -g @ionic/cli
Clonar e instalar
bashgit clone https://github.com/TU_USUARIO/pokeapp-ionic.git
cd pokeapp-ionic
npm install --legacy-peer-deps
Ejecutar en el navegador
bashionic serve
Abre http://localhost:8100 en tu navegador.
Compilar para Android
bashionic build
ionic capacitor add android
ionic capacitor sync android
ionic capacitor open android
Luego ejecuta desde Android Studio con un emulador o dispositivo físico.

🔑 Credenciales de prueba
UsuarioEmailContraseñaEntrenador Demodemo@demo.comdemo123Ash Ketchumash@pokemon.compikachu123Mistymisty@pokemon.comstaryu123

⚠️ La autenticación es simulada (mock). No hay backend real.


📁 Estructura del proyecto
src/
├── app/
│   ├── guards/
│   │   └── auth.guard.ts          # Guard funcional (CanActivateFn)
│   ├── services/
│   │   ├── auth.service.ts        # Autenticación mock + localStorage
│   │   └── pokemon.service.ts     # Consumo de PokéAPI + favoritos
│   ├── pages/
│   │   ├── login/                 # Página de inicio de sesión
│   │   ├── home/                  # Dashboard principal
│   │   ├── pokemon-list/          # Pokédex con búsqueda y filtros
│   │   ├── pokemon-detail/        # Detalle de un Pokémon
│   │   └── favorites/             # Pokémon favoritos
│   ├── app.component.ts           # Root con menú lateral
│   └── app.routes.ts              # Rutas standalone
├── environments/                  # Variables de entorno
├── theme/
│   └── variables.scss             # Variables CSS de Ionic
└── global.scss                    # Estilos globales

🌐 API utilizada
Este proyecto usa PokéAPI — una API REST pública y gratuita.
EndpointUsoGET /pokemon?limit=20&offset=0Lista paginada de PokémonGET /pokemon/{id}Detalle de un PokémonGET /pokemon-species/{id}Descripción y datos de especie

🤝 Contribuciones
Las contribuciones son bienvenidas. Por favor no sea tan cruel profe.

Haz un fork del proyecto
Crea tu rama: git checkout -b feature/nueva-funcionalidad
Haz commit de tus cambios: git commit -m 'feat: agrega nueva funcionalidad'
Push a tu rama: git push origin feature/nueva-funcionalidad
Abre un Pull Request

📄 Licencia
© 2026 — Todos los derechos reservados.

HECHO POR:

*JOSE ALBERTO CASARRUBIAS 
--------------------------------------------------
*JOSE PABLO ROBLES HUERTA 
--------------------------------------------------

<p align="center">
  Hecho con ❤️ y mucho café ☕ — Datos provistos por <a href="https://pokeapi.co/">PokéAPI</a>
</p>
