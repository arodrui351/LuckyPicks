# Aplicacion desplegada en:

https://www.luckypicks.es/

https://luckypicks.es/

# Diseño en el enlace: 
https://www.canva.com/design/DAGqQVc3z9A/cP0JET-6RXWYEI2hdk6qhQ/view?utm_content=DAGqQVc3z9A&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha9e14cddee

# Presentacion:
  https://www.canva.com/design/DAGqQiJUYyM/A-dQ56CYu3Jp-DIU3FaG2g/view?utm_content=DAGqQiJUYyM&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hc8b9ccd667

# Bibliografia utilizada:
  
## Laravel (backend):

  - Laravel Documentation: https://laravel.com/docs

  - Laravel Migrations: https://laravel.com/docs/migrations

  - Laravel Routing: https://laravel.com/docs/routing

  - Laravel Authentication: https://laravel.com/docs/authentication

## React (frontend):

  - React Documentation: https://react.dev/learn

  - React Router DOM: https://reactrouter.com/en/main

  - Vite (React + build tool): https://vitejs.dev/guide/

## Despliegue y servidor:

  - Certbot (SSL gratuito Let's Encrypt): https://certbot.eff.org/

  - Apache Virtual Hosts: https://httpd.apache.org/docs/current/vhosts/

  - FileZilla (subida de archivos al servidor): https://filezilla-project.org/

  - Configuración de DNS en dominios: documentación del proveedor (IONOS)

## General:

  - Stack Overflow (consultas específicas): https://stackoverflow.com/

## Tutoriales vistos:

  - Slot machine: https://www.youtube.com/watch?v=boI2B4Gpp34&list=PL4EHQd0TXP3udFYfDDtPlwQxRvx6HQY-j&ab_channel=CodeJos

  - Cartas:
      - https://www.youtube.com/watch?v=c0eigGnotm0&list=PL4EHQd0TXP3udFYfDDtPlwQxRvx6HQY-j&index=2&ab_channel=VictorTalamantes

      - https://www.youtube.com/watch?v=FIEVxNdnEow&list=PL4EHQd0TXP3udFYfDDtPlwQxRvx6HQY-j&index=3&ab_channel=SergioDevWeb

      - https://www.youtube.com/watch?v=bMYCWccL-3U&list=PL4EHQd0TXP3udFYfDDtPlwQxRvx6HQY-j&index=4&ab_channel=KennyYipCoding

# Tutorial para lanzar el proyecto

  ## Requisitos
    Xampp
    Tener instalado PHP y Composer

  ## Pasos
  1. Inicie MySQL y apache en xampp
  2. Revise el .env dentro de la carpeta Backend para poner una cuenta de mysql valida
  3. Dentro de la carpeta Backend ejecute el comando php artisan migrate (Creara la base de datos con sus tablas y relaciones)
  4. Posteriormente, en la misma carpeta de Backend ejecutar el comando php artisan serve
  5. Dentro de la carpeta Frontend ejecute el comando npm install (Instala las dependencias necesarias del proyecto)
  6. Posteriormente ejecutar el comando npm run dev
  5. Acceda a la url proporcionada para ver el proyecto lanzado
    
