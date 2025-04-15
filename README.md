
# E-Commerce Catalog Microservice

Este microservicio es parte del proyecto de E-Commerce basado en una arquitectura **Event-Driven + Event Sourcing**. Su función es gestionar el catálogo de productos, permitiendo cargar (seeder) el catálogo y realizar búsquedas por ID, nombre o categoría. Cada acción genera y envía un evento a Kafka para que otros servicios (por ejemplo, para el almacenamiento o procesamiento posterior) puedan reaccionar.

## Tabla de Contenidos

- [Arquitectura y Flujo de Eventos](#arquitectura-y-flujo-de-eventos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos](#requisitos)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Endpoints de la API](#endpoints-de-la-api)
- [Eventos y Tópicos de Kafka](#eventos-y-tópicos-de-kafka)
- [Notas Adicionales](#notas-adicionales)

## Arquitectura y Flujo de Eventos

El microservicio se basa en una arquitectura **Event-Driven** en la que cada acción (carga de catálogo o búsqueda de productos) dispara un evento a Kafka. Estos eventos siguen el enfoque de **Event Sourcing**, registrando tanto la acción (payload) como el resultado (snapshot).

- **Event-Driven Architecture (EDA):**  
  Los servicios reaccionan a eventos en vez de comunicarse de forma sincrónica. Esto permite mayor desacoplamiento y escalabilidad.

- **Event Sourcing:**  
  Cada acción se registra como un evento (por ejemplo, `ProductCreated`, `ProductSearchById`, etc.) para que se pueda reconstruir el estado o auditarlos.

## Estructura del Proyecto

La estructura de carpetas recomendada es la siguiente:

```
ecommerce-catalog/
├── package.json           # Configuración y dependencias del proyecto Node.js
├── README.md              # Documentación del microservicio
└── src/
    ├── index.js           # Archivo principal para levantar el servidor Express
    ├── routes/
    │   └── products.js    # Rutas relacionadas con el catálogo y búsquedas de productos
    └── services/
        └── kafkaProducer.js  # Módulo para enviar eventos a Kafka
```

## Requisitos

- **Node.js (versión LTS recomendada)**  
- **npm** (incluido con Node.js)
- Una instancia de **Apache Kafka** corriendo (por ejemplo, mediante Docker Compose).
- Acceso a la API Fake (por ejemplo, [Fake Store API](https://fakestoreapi.com/products)) para obtener la lista de productos.

## Instalación y Ejecución

1. **Clonar el repositorio o crear la carpeta del proyecto:**

   ```bash
   git clone https://github.com/GabrielCarrilloF/ecommerce-catalog.git
   cd ecommerce-catalog
   ```

2. **Instalar las dependencias:**

   ```bash
   npm install
   ```

3. **Configurar Kafka:**  
   Asegúrate de que tu instancia de Kafka esté corriendo en `localhost:9092` o ajusta la configuración en `src/services/kafkaProducer.js`.

4. **Ejecutar el servidor:**

   - Modo desarrollo :
     ```bash
     npm run dev
     ```

5. **Verificar:**  
   Abre un navegador o Postman y accede a:
   ```
   http://localhost:3000/api/products
   ```

## Endpoints de la API

El microservicio expone los siguientes endpoints:

### 1. Obtener Catálogo de Productos

- **URL:** `GET /api/products`
- **Descripción:**  
  Recupera la lista completa de productos consultando la API Fake y ejecuta el seeder, enviando un evento `ProductCreated` a Kafka.
- **Ejemplo de Respuesta:**  
  ```json
  [
    {
      "id": 1,
      "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      "price": 109.95,
      "description": "Your perfect pack for everyday use and walks in the forest.",
      "category": "men's clothing",
      "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
    },
    ...
  ]
  ```

### 2. Buscar Producto por ID

- **URL:** `GET /api/products/search/byId/:id`
- **Descripción:**  
  Busca y devuelve un producto filtrando por ID. Se envía un evento `ProductSearchById` a Kafka.
- **Ejemplo:**  
  ```
  GET /api/products/search/byId/1
  ```

### 3. Buscar Productos por Nombre

- **URL:** `GET /api/products/search/byName`
- **Parámetro Query:** `name=<nombre>`
- **Descripción:**  
  Filtra productos cuyo título contenga el término buscado (no sensible a mayúsculas). Se envía un evento `ProductSearchByName` a Kafka.
- **Ejemplo:**  
  ```
  GET /api/products/search/byName?name=shirt
  ```

### 4. Buscar Productos por Categoría

- **URL:** `GET /api/products/search/byCategory/:category`
- **Descripción:**  
  Devuelve los productos que coincidan exactamente con la categoría especificada. Se envía un evento `ProductSearchByCategory` a Kafka.
- **Ejemplo:**  
  ```
  GET /api/products/search/byCategory/jewelery
  ```

## Eventos y Tópicos de Kafka

Cada flujo de operación genera un evento que se envía a Kafka. A continuación se muestra un resumen de los eventos clave:

| **Tópico**                   | **Flujo**                | **Origen (Source)**      | **Descripción (Payload)**                                       |
|------------------------------|--------------------------|--------------------------|-----------------------------------------------------------------|
| **ProductCreated**           | Catálogo de Productos    | ProductSeeder            | Contiene el catálogo completo de productos extraídos de la API.  |
| **ProductSearchById**        | Búsqueda por ID          | ProductService           | Contiene el ID buscado y el resultado de la búsqueda.           |
| **ProductSearchByName**      | Búsqueda por Nombre      | ProductService           | Contiene el término de búsqueda y la lista de productos filtrados.|
| **ProductSearchByCategory**  | Búsqueda por Categoría   | ProductService           | Contiene la categoría buscada y la lista de productos encontrados.|

Cada evento sigue la siguiente estructura básica:

```json
{
  "eventId": "evt_<timestamp>",
  "timestamp": "2025-04-17TXX:XX:XXZ",
  "source": "<Nombre del Servicio>",
  "topic": "<Tópico correspondiente>",
  "payload": { /* datos de entrada o de búsqueda */ },
  "snapshot": { /* resultado de la operación, ej: el producto o lista filtrada */ }
}
```

## Notas Adicionales

- **Kafka:**  
  Este microservicio utiliza la librería [KafkaJS](https://kafka.js.org/) para enviar eventos a Kafka. Asegúrate de tener Kafka corriendo o de usar Docker Compose para levantar la instancia necesaria.

- **API Fake:**  
  Se utiliza la [Fake Store API](https://fakestoreapi.com/products) para obtener productos. Puedes reemplazar la URL en `src/routes/products.js` si decides usar otra fuente de datos.

- **Integración:**  
  El responsable del almacenamiento y procesamiento posterior de los eventos en MongoDB es otro integrante del equipo; este microservicio se limita a enviar los eventos para que ellos puedan capturarlos y persistirlos.

- **Desarrollo y Depuración:**  
  Durante el desarrollo, revisa la consola del servidor para verificar los logs de envío de eventos y el correcto funcionamiento de los endpoints.

---

## Conclusión

Este microservicio implementa una parte esencial del proyecto de E-Commerce, proporcionando un catálogo de productos y diversos flujos de búsqueda, todo integrado en una arquitectura event-driven. Los eventos generados son enviados a Kafka, facilitando la comunicación y el procesamiento asíncrono de las acciones dentro del sistema.

¡Listo para integrarse y operar en conjunto con los demás servicios del proyecto!

