---
description: Start the Fullstack project (Frontend + Backend)
---

# Cómo iniciar el proyecto completo

Para que el sistema de login y registro funcione, debes tener tanto el backend como el frontend en ejecución.

## 1. Backend (Strapi)
Abre una terminal y ejecuta:
// turbo
```bash
cd backend
npm install
npm run dev
```
*Nota: Asegúrate de que Strapi esté configurado y tengas el plugin `users-permissions` activo (viene por defecto).*

## 2. Frontend (Next.js)
Abre otra terminal y ejecuta:
// turbo
```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en [http://localhost:3000](http://localhost:3000).

## 3. Configuración en Strapi
Para permitir el registro desde el frontend:
1. Entra al panel de Strapi ([http://localhost:1337/admin](http://localhost:1337/admin)).
2. Ve a **Settings > Users & Permissions Plugin > Roles**.
3. Edita el rol **Public**.
4. En **Users-Permissions**, busca `callback`, `register`, `forgotPassword`, y `resetPassword` y dales permiso.
5. Haz lo mismo para el rol **Authenticated** si es necesario.
