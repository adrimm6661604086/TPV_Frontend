<h1 align="center">📱 TPV Virtual – Frontend React Native</h1>

<p align="center">
  Interfaz móvil para el proyecto TPV Virtual, una solución de punto de venta ágil, segura y sin hardware adicional.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react--native-v0.72-blue?logo=react" />
  <img src="https://img.shields.io/badge/platform-Android%20%7C%20iOS-lightgrey" />
  <img src="https://img.shields.io/badge/status-completed-brightgreen" />
  <img src="https://img.shields.io/github/issues/adrimm6661604086/TPV_Frontend" />
</p>

---

## 🧭 Tabla de Contenidos

- [📝 Descripción General](#-descripción-general)
- [🎯 Objetivos del Proyecto](#-objetivos-del-proyecto)
- [🔧 Características Funcionales](#-características-funcionales)
- [📐 Arquitectura General](#-arquitectura-general)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🚀 Instalación y Ejecución](#-instalación-y-ejecución)
- [🔐 Seguridad Aplicada](#-seguridad-aplicada)
- [📚 Stack Tecnológico](#-stack-tecnológico)
- [📄 Enlaces Importantes](#-enlaces-importantes)
- [🪪 Licencia](#-licencia)

---

## 📝 Descripción General

TPV Virtual es una solución integral diseñada para permitir que cualquier dispositivo móvil actúe como un terminal punto de venta (POS). Esta app es el cliente que interactúa con el backend y simula operaciones financieras reales, respetando estándares de seguridad y usabilidad.

---

## 🎯 Objetivos del Proyecto

- Permitir el procesamiento de pagos en tiempo real sin hardware adicional.
- Ofrecer una experiencia fluida al usuario final, optimizada para móviles.
- Aplicar técnicas modernas de diseño de software, como arquitectura modular y separación de responsabilidades.
- Cumplir con normativas de protección de datos y buenas prácticas de ciberseguridad.

---

## 🔧 Características Funcionales

- 🔑 **Autenticación de usuarios** con persistencia de sesión.
- 💳 **Simulación de pagos** mediante NFC (lectura de tarjeta virtual).
- 📈 **Visualización de estadísticas** e histórico de transacciones.
- 🔐 Gestión de **PIN y validación de operaciones bancarias**.
- 🌐 Comunicación segura con el backend (token, HTTPS).
- 🧑‍💼 Portal administrativo para clientes y autónomos.

---

## 📐 Arquitectura General

- **Frontend** (React Native): Interfaz de usuario, captura de datos, navegación.
- **Backend** (Node.js): Lógica de negocio, autenticación, operaciones bancarias.
- **Simulador Bancario** (Go): Verificación de fondos, respuesta simulada de una entidad financiera.
- Comunicación entre capas mediante APIs RESTful.
- Diseño modular basado en principios SOLID y buenas prácticas mobile-first.

---

## 📁 Estructura del Proyecto

```
TPV_FRONTEND
├── src/
│   ├── assets/        # Imágenes, iconos y recursos visuales
│   ├── components/    # Componentes reutilizables
│   ├── context/       # Contextos globales (AuthContext, ThemeContext)
│   ├── hooks/         # Custom hooks (useAuth, usePayment, etc.)
│   ├── screens/       # Pantallas principales de navegación
│   ├── types/         # Tipos globales para TypeScript
│   └── utils/         # Funciones auxiliares, helpers
├── android/           # Configuración nativa para Android
├── ios/               # Configuración nativa para iOS
├── App.tsx            # Entrada principal de la aplicación
├── .env               # Variables de entorno
├── package.json       # Dependencias del proyecto
└── tsconfig.json      # Configuración de TypeScript
```

---

## 🚀 Instalación y Ejecución

1. Clona el repositorio:

   ```bash
   git clone https://github.com/adrimm6661604086/TPV_Frontend.git
   cd TPV_Frontend
   ```

2. Instala dependencias:

   ```bash
   npm install
   ```

3. Ejecuta la app:

   ```bash
   npx react-native run-android
   # o si usas iOS:
   npx react-native run-ios
   ```

4. Asegúrate de que el backend y simulador bancario estén activos.

---

## 🔐 Seguridad Aplicada

- Cifrado de datos sensibles usando **HTTPS y JWT**.
- Protección contra manipulación de tarjetas o datos con validación previa.
- Autenticación segura basada en tokens y cifrado AES desde backend.
- Accesos restringidos por rol para usuarios y administradores.

---

## 📚 Stack Tecnológico

| Capa            | Tecnología           |
|-----------------|----------------------|
| Frontend        | React Native + TypeScript |
| Navegación      | React Navigation     |
| Estado global   | React Context + Hooks|
| Comunicación    | Axios (RESTful APIs) |
| Estilos         | Tailwind-like + StyleSheet |
| Seguridad       | JWT, HTTPS, Validación de formularios |

---

## 📄 Enlaces Importantes

- 📱 **Frontend App**: [TPV_Frontend](https://github.com/adrimm6661604086/TPV_Frontend)
- ⚙️ **Backend Node.js API**: *(por agregar)*
- 🏦 **Simulador Bancario en Go**: *(por agregar)*
- 📘 **Informe del Proyecto (PDF)**: [`TPVVirtualMóvil-Informe.pdf`](../TPVVirtualMóvil-Informe.pdf)

---

## 🪪 Licencia

Este proyecto se distribuye bajo la Licencia MIT. Consulta el archivo [`LICENSE`](LICENSE) para más información.

---

> _Proyecto desarrollado como Trabajo Fin de Grado en Ingeniería Informática, calificado con Matrícula de Honor._
