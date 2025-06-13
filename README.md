Aplicacion desplegada en:

https://www.luckypicks.es/

https://luckypicks.es/

Diseño en el enlace: 



Tutorial para lanzar el proyecto

  Requisitos
    Xampp
    Tener instalado PHP y Composer

  Pasos
    1. Inicie MySQL y apache en xampp
    2. Revise el .env dentro de la carpeta Backend para poner una cuenta de mysql valida
    3. Dentro de la carpeta Backend ejecute el comando php artisan migrate (Creara la base de datos con sus tablas y relaciones)
    4. Posteriormente, en la misma carpeta de Backend ejecutar el comando php artisan serve
    5. Dentro de la carpeta Frontend ejecute el comando npm install (Instala las dependencias necesarias del proyecto)
    6. Posteriormente ejecutar el comando npm run dev
    5. Acceda a la url proporcionada para ver el proyecto lanzado
    
