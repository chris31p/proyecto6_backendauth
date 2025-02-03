🛒API de Autenticación y Gestión de Productos 

📌 Descripción

Esta es una API backend que implementa autenticación y autorización de usuarios mediante JWT (JSON Web Tokens). Permite la gestión de usuarios, productos y un carrito de compras, asegurando que cada usuario tenga control sobre sus datos y los productos asociados a su cuenta dependiendo el rol de cada usuario (vendedor o comprador).

La API está estructurada con MongoDB y Mongoose, interrelacionando los modelos de Usuario y Producto. También incluye un sistema de carrito de compras para administrar productos agregados por los usuarios.


🎯 Objetivos de Aprendizaje
- Implementar autenticación y autorización en una aplicación backend.
- Profundizar en el uso de MongoDB y Mongoose para la gestión de datos.
- Aplicar operaciones CRUD para usuarios y productos.
- Documentar servicios usando OpenAPI y Swagger.
- Construir una API REST con Node.js, Express.js, Cors y Dotenv.
- Desplegar la API en Render.com y gestionar la base de datos en MongoDB Atlas.
  
🛠️ Tecnologías Utilizadas
- Node.js y Express.js para el backend.
- MongoDB y Mongoose para la base de datos.
- JWT para autenticación y autorización.
- Bcrypt para el hashing de contraseñas.
- Swagger (OpenAPI) para la documentación.
- Render.com para el despliegue del backend.
- MongoDB Atlas para el almacenamiento en la nube.


🚀 Instalación y Uso

1️⃣ Clonar el repositorio
    
      git clone https://github.com/tu-usuario/tu-repositorio.git
      cd tu-repositorio
      
2️⃣ Instalar dependencias

    npm install
    
3️⃣ Configurar variables de entorno
  Crea un archivo .env en la raíz del proyecto y agrega:

    env
    PORT=3000
    MONGO_URI=tu_url_de_mongodb_atlas
    JWT_SECRET=tu_clave_secreta
    
4️⃣ Iniciar el servidor
    
    npm run start
    El servidor se ejecutará en http://localhost:3000

📖 Documentación de la API
  - Swagger está disponible en:
    
    http://localhost:3000/api-docs
    
![image](https://github.com/user-attachments/assets/e7f38084-0715-4204-90f3-72e5d9dde860)

![image](https://github.com/user-attachments/assets/d8688b2f-971a-4735-bb18-70e410e7f50f)

📌 Endpoints Principales

🔹 Usuarios

- POST /api/users/register → Registro de usuarios.
- POST /api/users/login → Inicio de sesión y obtención de token JWT.
- GET /api/users/verifytoken → Verificación de token de sesión.
- PUT /api/users/update/:id → Actualización de perfil de usuario.

![image](https://github.com/user-attachments/assets/61661030-07fc-494d-9697-b036f7fa0a4c)
  
  Login usuario rol = comprador:
  
  ![image](https://github.com/user-attachments/assets/16f2b6e1-59ff-4b18-bf96-955a4cdafb0b)
  ![image](https://github.com/user-attachments/assets/afc388ce-f615-4504-93b0-dedb18efa55e)
    
  Verificar un usuario:
  
  ![image](https://github.com/user-attachments/assets/0ab5b157-475f-4271-b995-f98cc851ecfe)



🔹 Productos

- POST /api/products/crear-producto → Crear un nuevo producto (requiere autenticación).
- GET /api/products/obtener-productos → Obtener todos los productos.
- GET /api/products/ver-producto/:id → Obtener un producto por ID.
- PUT /api/products/actualizar-producto/:id → Actualizar un producto (requiere autenticación).
- DELETE /api/products/eliminar-producto/:id → Eliminar un producto (requiere autenticación).
  
![image](https://github.com/user-attachments/assets/e822ef6c-e9a3-4db9-97e9-ea89764f4b9e)
    
![image](https://github.com/user-attachments/assets/04ec2f59-d62a-493a-96ca-f654fa5b4aa5)


🔹 Carrito de Compras
- GET /api/cart/get-cart → Obtener o crear el carrito de un usuario autenticado.
- POST /api/cart/add-to-cart → Agregar productos al carrito.
- PUT /api/cart/update-cart → Modificar cantidad de un producto en el carrito.
- DELETE /api/cart/remove-from-cart → Eliminar un producto del carrito.
    
![image](https://github.com/user-attachments/assets/f141b8ea-dd01-4f0a-95fa-588dd93ef4bf)

![image](https://github.com/user-attachments/assets/6ec18b24-d6da-424c-971d-bd6caa6f13f8)

![image](https://github.com/user-attachments/assets/c9ae1745-8ac9-49b4-952f-20f04ffdd841)


🚀 Despliegue en Render.com

1️⃣ Crear una cuenta en Render
- Si no tienes una cuenta, regístrate en Render.com y accede a tu panel de control.

2️⃣ Crear un nuevo servicio
- Dirígete a "New Web Service".
- Conecta tu repositorio de GitHub.
- Selecciona la rama que contiene tu código.
  
3️⃣ Configurar la API en Render
- Nombre del servicio: Especifica un nombre para tu API.
- Runtime: Selecciona Node.js.
- Comando de inicio, usa:
  
      bash
      npm start
  
- Variables de entorno: Agrega las mismas variables que en tu .env:
  
      PORT=3000
      MONGO_URI=tu_url_de_mongodb_atlas
      JWT_SECRET=tu_clave_secreta
  
4️⃣ Desplegar la API
- Haz clic en "Create Web Service" y Render iniciará el despliegue.
- Una vez completado, Render proporcionará una URL pública para tu API.

  
🌎 Acceso a la API Desplegada:

- La API está desplegada en:   
    🔗 Render.com - Backend
  
  https://proyecto6-backendauth.onrender.com
  
  ![image](https://github.com/user-attachments/assets/3d39c0d4-172f-477f-939c-d625cfc71a1d)

    
- Base de datos en:   
    🔗 MongoDB Atlas
  
![image](https://github.com/user-attachments/assets/4c3ccfcf-e2e8-46ac-b027-961b1658f271)
