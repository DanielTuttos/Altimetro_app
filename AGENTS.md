This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

# Directrices de Desarrollo del Proyecto: Altimeter Mobile (React Native + Expo)

Este documento es la fuente de verdad arquitectónica y técnica para cualquier asistente de IA, agente o desarrollador que interactúe con este repositorio. Debe ser leído y aplicado estrictamente antes de generar, refactorizar o modificar cualquier archivo.

---

## 1. Rol y "Skills" Contextuales del Agente

Actúa como un Desarrollador Senior en React Native, TypeScript y Arquitectura Orientada al Dominio (Domain-Driven Design).

- **Skill 1: Purismo de Dominio (Hexagonal / Clean Architecture)**
  - La carpeta `src/features/*/domain/` es sagrada. No puede importar React, React Native, Expo, librerías de red, UI o utilidades externas.
  - Solo contiene TypeScript puro: entidades (`*.entity.ts`), objetos de valor (Value Objects), interfaces/contratos de repositorio (`*.repository.interface.ts`) y casos de uso (`*.usecase.ts`).
- **Skill 2: Especialista en Pruebas y TDD**
  - Todo caso de uso, repositorio e integración crítica debe contar con su correspondiente archivo de test unitario en Jest dentro del directorio `__tests__/`.
  - Se deben aislar los sensores y servicios externos mediante mocks tipados (`jest.fn()`).
- **Skill 3: Modularidad y Responsabilidad Única (SRP)**
  - Un solo concepto por archivo: prohibido agrupar múltiples entidades, contratos o componentes en un solo archivo `.ts`/`.tsx`.
  - Nombrado explícito y predecible: `[nombre].[tipo].ts` (ejemplo: `altitude.entity.ts`, `get-altitude.usecase.ts`, `altitude.store.ts`).
- **Skill 4: UX/UI Minimalista Funcional**
  - La aplicación debe seguir una estética limpia, inspirada en instrumentación técnica moderna: foco en la tipografía, lectura numérica grande en metros (`m`), márgenes limpios y sin sobrecarga visual.
  - Soporte obligatorio para modo claro y modo oscuro nativos.

---

## 2. Pila Tecnológica y Decisiones de Arquitectura

- **Framework:** Expo SDK (Managed Workflow / Prebuild según requiera AdMob) con Expo Router (`src/app/`).
- **Lenguaje:** TypeScript con modo estricto (`"strict": true`).
- **Sensores de Altitud:**
  - Primario: `expo-location` (coordenadas, altitud base WGS84 y precisión vertical).
  - Barómetro: `expo-sensors` (para variaciones barométricas en hardware compatible).
  - Corrección Geográfica / Respaldo: Open-Meteo Elevation API (servicio gratuito, sin API key, para obtener el modelo digital de elevación sobre el nivel del mar).
- **Gestión de Estado:** Zustand (desacoplado de la capa de UI).
- **Persistencia Local:** `@react-native-async-storage/async-storage` o MMKV (persistencia de tema, timestamp del último interstitial y caché offline).
- **Monetización:**
  - Suscripciones: `react-native-purchases` (RevenueCat) con usuario anónimo (sin autenticación requerida).
  - Anuncios: `react-native-google-mobile-ads` (Banner inferior adaptativo + Interstitial a pantalla completa controlado por tiempo).
- **Testing:** Jest + `@testing-library/react-native`.

---

## 3. Estructura de Directorios Mandatoria

```text
.
├── AGENT_GUIDELINES.md            # Este archivo de reglas
├── app.json
├── package.json
├── tsconfig.json
├── __tests__/                     # Tests unitarios estructurados en espejo con src/
│   └── features/
│       └── altitude/
│           ├── domain/
│           └── infrastructure/
└── src/
    ├── core/                      # Componentes transversales
    │   ├── theme/                 # Paletas light/dark y tipografía
    │   ├── errors/                # Clases Failure y excepciones base
    │   └── di/                    # Inyección de dependencias o service locators
    │
    ├── features/                  # Módulos organizados por dominio
    │   ├── altitude/              # Módulo principal de Altitud
    │   │   ├── domain/
    │   │   │   ├── entities/
    │   │   │   ├── repositories/
    │   │   │   └── usecases/
    │   │   ├── infrastructure/
    │   │   │   ├── datasources/
    │   │   │   ├── dtos/
    │   │   │   └── repositories/
    │   │   └── presentation/
    │   │       ├── store/
    │   │       ├── hooks/
    │   │       └── components/
    │   │
    │   ├── monetization/          # Ads e In-App Purchases
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   │
    │   └── settings/              # Preferencias y permisos del sistema
    │       ├── presentation/
    │       └── hooks/
    │
    └── app/                       # Rutas de navegación (Expo Router)
        ├── _layout.tsx
        ├── index.tsx              # Dashboard del altímetro
        └── settings.tsx           # Pantalla de configuración y temas
```

4. Reglas de Negocio Específicas
   Monetización No Intrusiva:

El banner inferior se renderiza en la pantalla principal y debe desmontarse automáticamente si la entidad del usuario tiene el derecho activo (isPro === true).

El interstitial solo se dispara si han transcurrido al menos 120 minutos (2 horas) de uso acumulado respecto al último anuncio mostrado (lastInterstitialAt), y siempre en un evento de transición o activación de la app (AppState === 'active'), nunca interrumpiendo una lectura estática en curso.

Acceso Sin Registro:

La app no debe requerir inicio de sesión ni registro previo. RevenueCat debe operar con su ID anónimo generado por dispositivo.

Manejo de Permisos:

Si el usuario rechaza los permisos de ubicación, la UI no debe romperse; debe mostrar una vista clara que explique el motivo y ofrezca un botón directo a los ajustes del sistema operativo mediante Linking.openSettings().

5. Flujo de Trabajo para Cualquier Modificación o Feature Nueva
   Cuando recibas una solicitud para crear o modificar una funcionalidad, debes seguir este orden estricto paso a paso:

Paso 1 (Domain): Crear o actualizar la entidad pura y la interfaz del repositorio en domain/.

Paso 2 (UseCase): Implementar el caso de uso que encapsula la lógica de negocio.

Paso 3 (Infrastructure): Conectar la API, sensor o servicio en infrastructure/ implementando el contrato de la interfaz.

Paso 4 (Tests): Escribir los tests unitarios en **tests**/ para el caso de uso y el repositorio con mocks.

Paso 5 (Presentation): Conectar el store de Zustand y exponer los hooks para renderizar la UI minimalista en presentation/ o app/.
