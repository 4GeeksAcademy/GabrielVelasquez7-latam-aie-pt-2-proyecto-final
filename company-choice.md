# Elección de Empresa: Brasaland

Elegí la empresa BRASALAND porque me llama mucho la atención su modelo de negocio y el reto de escalabilidad que afronta. En mi experiencia, he trabajado en proyectos similares que sufrían de una gran desorganización debido al uso excesivo de hojas de cálculo de Excel y procesos manuales atrasados. Me parece un desafío fascinante diseñar una solución tecnológica que unifique la operación en vivo para dos países (Colombia y Estados Unidos), manejando dos monedas distintas (COP y USD). Siento que resolver esto mejorará drásticamente la productividad del negocio, automatizando tareas repetitivas para que el equipo pueda enfocarse en la expansión de la marca.

Después de analizar el briefing, los dos departamentos cuyos problemas encontré más interesantes son:
1. Dirección Ejecutiva: Liderado por Mariana Restrepo. Me parece un reto clave porque, al ser el último nivel de la cadena, requiere que la infraestructura de datos de todas las demás áreas funcione a la perfección. Me llama mucho la atención la necesidad de crear un asistente de IA en lenguaje natural y la automatización del informe semanal.

2. Compras y Proveedores: Liderado por Lucía Fernández. Al operar en dos mercados con alrededor de 20 proveedores, consolidar el historial de precios y generar alertas automáticas es crucial para que el negocio pueda cerrar tratos con información precisa, optimizando las compras centralizadas y asegurando el profit.

El reto de automatización e IA del milestone map que más ganas tengo de construir es el Asistente de IA en lenguaje natural para la Dirección Ejecutiva, conectado a la telemetría y consolidación de datos en tiempo real de los 14 locales.

---

## ## Mi idea de Agente de IA

Para resolver la necesidad de la CEO, Mariana Restrepo, propongo un Asistente Ejecutivo de Bolsillo impulsado por IA. 

¿Qué haría el agente?
Este agente actuará como un consultor financiero y operativo disponible 24/7 a través de un canal privado y seguro (por ejemplo, Telegram o WhatsApp), automatizado mediante un flujo en n8n. Mariana podrá hacerle preguntas directamente en lenguaje natural (como: "¿Cuál fue el ticket medio en Florida esta semana?" o "¿Qué local vendió más ayer?") y el agente responderá al instante con métricas exactas. Además, cada lunes a las 7:00 AM, el agente procesará los datos acumulados y enviará de forma proactiva un informe ejecutivo en formato de texto limpio o PDF.

¿Qué información necesitaría?
Para funcionar sin "alucinar", el agente requerirá acceso directo a la API Central de Brasaland (que el equipo del CTO, Nicolás Park solicito). Específicamente, necesitará consumir el pipeline de datos de ventas en tiempo real de los puntos de venta (POS) de ambos países, la tabla de conversión de divisas actualizada, y el historial de reportes de operaciones.

¿Qué produciría o desencadenaría?
* Salidas inmediatas:Respuestas de texto conversacionales con datos duros y gráficos sencillos de rendimiento directamente en el chat.
* Disparadores automáticos (Triggers):Un cron-job semanal en n8n que recopile el cierre de caja de la semana anterior, redacte el resumen ejecutivo y lo despache al canal de la CEO puntualmente todos los lunes por la mañana.