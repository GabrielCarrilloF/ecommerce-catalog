

# 🛍️ E-Commerce Catalog Microservice  

**Microservicio de Catálogo para E-Commerce**  
*Arquitectura Event-Driven + Event Sourcing | Búsqueda de Productos | Integración con Kafka*  

![Architecture](https://img.shields.io/badge/Architecture-Event--Driven-blue) 
![Kafka](https://img.shields.io/badge/Integration-Apache_Kafka-ff69b4) 
![API](https://img.shields.io/badge/Data_Source-FakeStoreAPI-green)

## 📌 Descripción  
Microservicio encargado de gestionar el catálogo de productos en un sistema E-Commerce basado en **Event-Driven Architecture (EDA)**. Proporciona:  
- Carga inicial de productos (*Seeder*) desde una API externa.  
- Búsquedas por **ID**, **nombre** o **categoría**.  
- Generación de eventos en **Kafka** para cada acción (Event Sourcing).  

---

## 🚀 **Quick Start**  

### Requisitos Previos  
- Node.js (v18+)  
- Kafka (ejecutando en `localhost:9092`)  
- [Fake Store API](https://fakestoreapi.com/products) (fuente de datos)  

### Instalación  
```bash
git clone https://github.com/GabrielCarrilloF/ecommerce-catalog.git
cd ecommerce-catalog
npm install
```

### Ejecución  
```bash
npm run dev  # Modo desarrollo 
```

### Verificación  
```bash
curl http://localhost:3000/api/products
```

---

## 📚 **Documentación de la API**  

### Endpoints  

| Método | Endpoint                          | Descripción                                  | Evento Kafka            |
|--------|-----------------------------------|----------------------------------------------|-------------------------|
| `GET`  | `/api/products`                   | Obtiene todos los productos (Seeder)         | `ProductCreated`        |
| `GET`  | `/api/products/search/byId/:id`   | Busca un producto por ID                     | `ProductSearchById`     |
| `GET`  | `/api/products/search/byName`     | Filtra productos por nombre (query param)    | `ProductSearchByName`   |
| `GET`  | `/api/products/search/byCategory` | Filtra productos por categoría               | `ProductSearchByCategory` |

---

## 🔄 **Flujo de Eventos en Kafka**  

Cada acción genera un evento con la siguiente estructura:  
```json
{
  "eventId": "evt_<timestamp>",
  "timestamp": "2025-04-17T12:00:00Z",
  "source": "CatalogService",
  "topic": "ProductCreated",
  "payload": { /* Datos de entrada */ },
  "snapshot": { /* Resultado de la operación */ }
}
```

### Tópicos y Usos  
| Tópico                   | Descripción                                  | Ejemplo de Payload                     |
|--------------------------|----------------------------------------------|----------------------------------------|
| `ProductCreated`         | Catálogo completo cargado desde la API       | `{ products: [...] }`                  |
| `ProductSearchById`      | Búsqueda por ID (ej: `id=5`)                 | `{ id: 5, product: {...} }`            |
| `ProductSearchByName`    | Búsqueda por nombre (ej: `name=shirt`)       | `{ query: "shirt", results: [...] }`   |
| `ProductSearchByCategory`| Búsqueda por categoría (ej: `electronics`)   | `{ category: "electronics", [...] }`   |

---

## 🏗️ **Estructura del Proyecto**  

```plaintext
src/
├── index.js                # Servidor Express
├── routes/
│   └── products.js         # Lógica de endpoints
└── services/
    ├── kafkaProducer.js    # Configuración de Kafka
    └── productService.js   # Lógica de negocio
```

---

## 🛠️ **Integración y Próximos Pasos**  
- **Almacenamiento en MongoDB**: Otro microservicio consumirá los eventos para persistir datos.  
- **Escalabilidad**: Diseñado para manejar alta carga con Kafka como broker.  
- **Monitorización**: Se recomienda añadir logs estructurados (ej: Winston + ELK).  

---

## 📝 **Notas Adicionales**  
- ✅ **KafkaJS**: Librería utilizada para la conexión con Kafka.  
- 🔄 **Desacoplado**: Puede reemplazarse la API Fake por cualquier otra fuente de datos.  
- 📊 **Auditoría**: Todos los eventos quedan registrados para trazabilidad.  

---

## ✨ **Conclusión**  
Este microservicio es la piedra angular del catálogo en el ecosistema E-Commerce, permitiendo búsquedas eficientes y garantizando consistencia mediante eventos.  

**¡Listo para producción!** 🚀  

--- 

### 🔗 **Recursos**  
- [Documentación de KafkaJS](https://kafka.js.org/)  
- [Fake Store API](https://fakestoreapi.com)  

 

**Mejoras clave respecto a tu versión original**:  
1. **Enfoque visual**: Uso de emojis, badges y tablas para mejor legibilidad.  
2. **Estructura clara**: Separación por secciones con Quick Start primero.  
3. **Detalles técnicos**: Explicación concisa de Kafka y eventos.  
4. **Profesionalismo**: Lenguaje técnico pero accesible, sin redundancias.  

