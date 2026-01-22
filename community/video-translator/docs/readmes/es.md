# 🎬 Traducción de subtítulos de vídeo en tiempo real

Sistema que traduce subtítulos de vídeo en tiempo real utilizando el SDK de [`lingo.dev`](https://lingo.dev/). Diseñado con arquitectura monorepo: frontend en Vercel, servidor de traducción WebSocket en Render.

## Planteamiento del problema

Una empresa global de alimentación desea alcanzar mercados internacionales. Su sitio web y contenido de vídeo, incluyendo texto de interfaz, contenido SEO y vídeos relacionados con alimentos deben soportar múltiples idiomas.

Actualmente, todo el contenido de vídeo está en inglés, y traducir manualmente los subtítulos para cada vídeo consume tiempo y es costoso. La empresa busca una solución impulsada por IA que pueda:

- Traducir automáticamente la interfaz del sitio web a múltiples idiomas

- Generar y traducir subtítulos de vídeo en tiempo real

- Garantizar contenido multilingüe optimizado para SEO

El objetivo es ahorrar tiempo, reducir costes y ofrecer una experiencia multilingüe fluida sin ampliar el equipo de traducción.

![Captura de pantalla de lingo.video en hindi](desktop.png)

## Índice

- [Instalación](#getting-started)
- [Demo de lingo.video](https://lingo-video.vercel.app/)
- [Arquitectura y stack tecnológico de traducción de subtítulos de vídeo en tiempo real](./docs/live-translation-architecture.md)
- [Impacto y beneficios para empresas globales](#impact--benefits-for-global-companies)
- [Características](#features)
- [Desafíos con la traducción en tiempo real y cómo los resolvemos](#challenges-with-real-time-translation--how-we-solve-them)
- [¿Qué sigue?](./docs/what-is-next.md)
- [Autor](#author)
- [Licencia](#license)

## Primeros pasos

1. Clonar repositorio
```
git clone https://github.com/ShubhamOulkar/lingo.video.git
cd lingo.video
```
2. Instalar dependencias
```
pnpm install
```
3. Obtener clave API de lingo.dev desde [`lingo.dev`](https://lingo.dev/)
4. Crear archivo `.env` y almacenar `LINGODOTDEV_API_KEY`
5. Ejecutar frontend y servidor websocket simultáneamente
```
pnpm dev
```

## Impacto y beneficios para empresas globales

Este sistema ofrece beneficios tangibles para organizaciones, especialmente empresas globales de alimentación y reparto:

- `Elimina el mantenimiento de archivos VTT`: No es necesario crear ni almacenar manualmente archivos de subtítulos .vtt para cada idioma.

- `Reduce costes de base de datos y almacenamiento`: Los subtítulos se generan y traducen al instante, por lo que las empresas no pagan por almacenar archivos en múltiples idiomas.

- `Minimiza la carga de trabajo para desarrolladores`: No se requiere esfuerzo adicional de desarrollo para mantener contenido de vídeo multilingüe.

- `Alcance temprano de mercados`: Los vídeos pueden distribuirse en días en lugar de meses, acelerando el alcance global.

- `Soporte ilimitado de idiomas`: La traducción impulsada por IA abre la puerta a alcanzar cualquier país del mundo.

- `Enfoque en el producto, no en la traducción`: Los equipos pueden concentrarse en mejorar el producto principal mientras el sistema gestiona automáticamente el contenido multilingüe.

## Características

- **Traducción de subtítulos en tiempo real**  
  - Traduce subtítulos de vídeo al instante utilizando el SDK de [`lingo.dev`](https://lingo.dev/en/sdk) y un servidor WebSocket.  
  - No es necesario mantener archivos `.vtt` para múltiples idiomas.
  > Nota: Este repositorio incluye [archivos .vtt](./apps/next-app/public/subtitles/emotions.hi.vtt) para pruebas manuales de precisión. Puede probarlo haciendo clic en `CC` y comparando con la traducción en vivo.

- **Traducción de interfaz en React**  
  - La interfaz de React se actualiza automáticamente utilizando [`Lingo Compiler`](https://lingo.dev/en/compiler) ⚡🤖.  
  - Compilación dinámica de idiomas sin codificar traducciones.

- **Contenido multilingüe optimizado para SEO**  
  - Genera automáticamente metaetiquetas y etiquetas Open Graph (OG) utilizando [`Lingo CLI`](https://lingo.dev/en/cli).  
  - Totalmente automatizable mediante pipelines CI/CD.
  > nota: Verifique las tarjetas og para hindi [aquí](https://opengraph.dev/panel?url=https%3A%2F%2Flingo-video.vercel.app%2Fhi) 

- **Eficiencia en tiempo y costes**  
  - Reduce el esfuerzo de los desarrolladores y elimina traductores externos.  
  - Distribuya contenido multilingüe en **días en lugar de meses**.  

- **Soporte ilimitado de idiomas**  
  - La traducción impulsada por IA permite alcanzar cualquier país del mundo.  
  - Añada fácilmente nuevos idiomas sin trabajo manual.  

- **Enfoque en el producto, no en la traducción**  
  - Los equipos pueden concentrarse en mejorar el producto principal mientras las traducciones ocurren automáticamente.  

- **Escala con el volumen de vídeos**  
  - Puede manejar gran cantidad de vídeos sin infraestructura o mantenimiento adicional.

- **Adaptación al tema preferido del sistema** 
  - El sitio web puede adaptarse automáticamente al tema claro u oscuro preferido por el usuario.

## Desafíos con la traducción en tiempo real y cómo los resolvemos

Los sistemas de traducción en tiempo real enfrentan varios desafíos técnicos y operativos. Este proyecto está diseñado con soluciones de nivel profesional para minimizar la latencia, reducir costos de traducción y garantizar precisión constante en contenido de video de alto volumen.

### ⚠️ Desafíos principales

1. **Latencia de red**: La traducción en tiempo real requiere comunicación WebSocket rápida. Cualquier inestabilidad de red puede retrasar actualizaciones de subtítulos.

2. **Retraso en generación de tokens LLM**: La calidad de traducción depende de la velocidad de generación de tokens del LLM. Alta carga o subtítulos extensos pueden aumentar el tiempo de respuesta. Lingo SDK no admite streaming.

3. **Costos redundantes de traducción**: Muchos subtítulos repiten el mismo texto en varios videos. Sin optimización, se factura múltiples veces la misma generación de tokens.

4. **Problemas de inicio en frío**: Las implementaciones sin servidor pueden experimentar tiempos de inicio lentos, afectando la entrega de subtítulos en tiempo real.

5. **Escalabilidad con tráfico alto**: Múltiples usuarios viendo videos simultáneamente pueden sobrecargar los servidores de traducción o socket si no están optimizados.

## Autor

- [LinkedIn](www.linkedin.com/in/shubham-oulkar)
- [Frontend Mentor](https://www.frontendmentor.io/profile/ShubhamOulkar)
- [X](https://x.com/shubhuoulkar)

## Licencia

El contenido enviado por [shubham oulkar](https://github.com/ShubhamOulkar) está bajo licencia Creative Commons Attribution 4.0 International, como se encuentra en el archivo [LICENSE](/LICENSE).

## 🌐 Readme en otros idiomas

[हिंदी](./docs/hi.md) • [日本語](./docs/ja.md) • [Français](./docs/fr.md) • [Deutsch](./docs/de.md) • [Español](./docs/es.md)