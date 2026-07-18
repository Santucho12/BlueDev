/* ============================================================
   i18n Vestra — cambio de idioma ES / EN sin recargar
   Marca los textos con  data-i18n="clave"  y aquí van las
   traducciones. Al cambiar de idioma se reemplaza el innerHTML.
   ============================================================ */
(function () {
  const translations = {
    es: {
      'nav.inicio': 'Inicio',
      'nav.sobre': 'Sobre Nosotros',
      'nav.servicios': 'Servicios',
      'nav.portfolio': 'Portfolio',
      'nav.cta': 'Comenzar Proyecto',
      'hero.badge': 'Agencia de desarrollo de software',
      'hero.title1': 'Convertí tu idea en ',
      'hero.title2': 'software que tu negocio necesita.',
      'hero.subtitle': 'Web, sistemas internos e IA. Construimos lo que tu negocio necesita para crecer.',
      'hero.card1.t': 'Páginas Web',
      'hero.card1.d': 'Convierte visitas en clientes',
      'hero.card2.t': 'Sistemas Internos',
      'hero.card2.d': 'Optimización y gestión de tu empresa',
      'hero.card3.t': 'IA & Automatización',
      'hero.card3.d': 'ELIMINÁ TAREAS REPETITIVAS Y OPTIMIZA TU TIEMPO',
      'hero.btn1': 'COMENZAR PROYECTO',
      'hero.btn2': 'VER SERVICIOS',

      'feature.1': '+28 Proyectos Completados',
      'feature.2': '100% CLIENTES SATISFECHOS',
      'feature.3': 'Soporte 24/7',

      'about.badge': 'CONOCENOS',
      'about.title': 'POTENCIAMOS NEGOCIOS CON <span class="about-title-highlight">TECNOLOGÍA.</span>',
      'about.desc': 'En <strong>Vestra</strong> desarrollamos webs, automatizaciones y sistemas a medida para empresas y emprendimientos. Con más de 3 años experiencia, combinamos conocimiento técnico y enfoque estratégico para crear productos alineados a los objetivos de cada cliente.',
      'about.li1': '<strong>Entrega en 3 a 6 semanas</strong> — cumplimos los tiempos acordados',
      'about.li2': '<strong>Código propio, sin dependencia de terceros</strong> — vos sos dueño de lo que construimos',
      'about.li3': '<strong>Soporte activo post-lanzamiento</strong> — seguimos acompañandote despues de la entrega',
      'about.stat1': 'Proyectos exitosos',
      'about.stat2num': '3 a 6 sem.',
      'about.stat2': 'Tiempo de entrega',
      'about.stat3': 'Respondemos tu consulta',

      'proceso.badge': 'CÓMO TRABAJAMOS',
      'proceso.title': 'Tu proyecto paso a paso',
      'proceso.s1.label': 'PASO 1',
      'proceso.s1.t': 'Primera reunión',
      'proceso.s1.d': 'Entendemos tu idea, objetivos y necesidades sin compromiso. Escuchamos qué querés lograr.',
      'proceso.s2.label': 'PASO 2',
      'proceso.s2.t': 'Propuesta y cotización',
      'proceso.s2.d': 'Alcance claro, tiempos y precio cerrado. Sin sorpresas ni costos ocultos.',
      'proceso.s3.label': 'PASO 3',
      'proceso.s3.t': 'Diseño y aprobación',
      'proceso.s3.d': 'Te mostramos el diseño antes de programar. Ajustamos hasta que te encante.',
      'proceso.s4.label': 'PASO 4',
      'proceso.s4.t': 'Desarrollo con avances',
      'proceso.s4.d': 'Construimos tu proyecto con entregas y feedback semanal. Siempre sabés en qué vamos.',
      'proceso.s5.label': 'PASO 5',
      'proceso.s5.t': 'Lanzamiento',
      'proceso.s5.d': 'Ponemos todo en producción, optimizado y listo para usar desde el primer día.',
      'proceso.s6.label': 'PASO 6',
      'proceso.s6.t': 'Acompañamiento',
      'proceso.s6.d': 'Seguimos con vos después de la entrega: soporte, mejoras y nuevas ideas.',
      'proceso.cta': 'Comenzar proyecto',

      'services.title': 'Nuestros Servicios',
      'services.subtitle': 'Soluciones de software de élite diseñadas para escalar tu negocio.',
      'svc1.tag': '01. WEBS',
      'svc1.t': 'Páginas Web',
      'svc1.d': 'Creamos sitios web rápidos, pensados para brindar una excelente experiencia de usuario y convertir visitas en clientes.',
      'svc1.f1': 'Navegación simple e intuitiva',
      'svc1.f2': 'Experiencia fluida en todos los dispositivos',
      'svc1.f3': 'Convertí visitas en clientes reales',
      'svc2.tag': '02. SISTEMAS',
      'svc2.t': 'Sistemas Internos',
      'svc2.d': 'Desarrollamos sistemas internos personalizados para optimizar la gestión y potenciar el crecimiento de tu empresa.',
      'svc2.f1': 'Control total de stock, ventas e ingresos',
      'svc2.f2': 'Panel de gestión para empleados y administradores',
      'svc2.f3': 'Información segura y centralizada en todo momento',
      'svc3.tag': '03. IA & AUTO',
      'svc3.t': 'Automatizaciones',
      'svc3.d': 'Automatizá tareas repetitivas y dejá que sistemas inteligentes trabajen por vos, ahorrando tiempo y recursos.',
      'svc3.f1': 'Respuestas automáticas 24/7',
      'svc3.f2': 'Automatización de tareas repetitivas',
      'svc3.f3': 'Ahorro de tiempo en procesos diarios',

      'portfolio.title': 'Nuestros Trabajos',
      'portfolio.subtitle': 'Proyectos reales que generan impacto, eficiencia y crecimiento.',
      'port1.t': 'Concesionaria Subaru',
      'port1.d': 'Sitio web institucional para concesionaria oficial Subaru y Suzuki. Catálogo de vehículos, consultas rápidas por WhatsApp y gestión de marcas premium.',
      'port.link': 'Ver proyecto',
      'port2.t': 'BitFlow Exchange',
      'port2.d': 'Plataforma de exchange de criptomonedas con trading, wallet, swap y monitoreo de mercados en tiempo real.',
      'port.nda': 'Proyecto bajo acuerdo de confidencialidad',
      'port3.t': 'Automatización de WhatsApp',
      'port3.d': 'Sistema de automatización para WhatsApp Business: respuestas automáticas, integración con catálogos y gestión de campañas promocionales.',

      'clients.title': 'Empresas que confían en nosotros',
      'clients.subtitle': 'Más de 28 proyectos exitosos respaldan nuestra trayectoria.',

      'reach.badge': 'PRESENCIA INTERNACIONAL',
      'reach.title': 'Alcance <span class="text-gradient">Global</span>',
      'reach.desc': 'Soluciones de software sin fronteras, con presencia estratégica en mercados clave de Iberoamérica y Europa.',
      'reach.s1': 'Países',
      'reach.s2': 'Continentes',
      'reach.s3': 'Soporte Global',
      'reach.s4': 'Proyectos IT',

      'faq.tag': 'Preguntas Frecuentes',
      'faq.title': 'Resolvemos tus dudas',
      'faq.q1': '¿Cuánto tiempo toma desarrollar un software?',
      'faq.a1': 'El tiempo de desarrollo varía según la complejidad, pero la mayoría de nuestros proyectos (webs premium, sistemas internos o automatizaciones) se completan en un rango de <strong>3 a 6 semanas</strong>.',
      'faq.q2': '¿El código es de mi propiedad?',
      'faq.a2': 'Absolutamente. Al finalizar el proyecto y completar el pago, entregamos la propiedad total del código fuente y toda la documentación técnica necesaria. En Vestra construimos activos para tu negocio, no dependencias.',
      'faq.q3': '¿Ofrecen soporte después del lanzamiento?',
      'faq.a3': 'Sí. Ofrecemos planes de soporte y mantenimiento post-lanzamiento para asegurar que tu software se mantenga actualizado, seguro y funcionando al 100% de su capacidad.',
      'faq.q4': '¿Qué tecnologías utilizan?',
      'faq.a4': 'Utilizamos un stack tecnológico moderno y escalable, incluyendo <strong>React, Next.js, Node.js y servicios en la nube (AWS/Google Cloud)</strong>. Elegimos la herramienta que mejor se adapte a los objetivos de tu negocio.',
      'faq.q5': '¿Pueden integrarse con mis sistemas actuales?',
      'faq.a5': 'Por supuesto. Nos especializamos en conectar tu software con herramientas de terceros como WhatsApp API, pasarelas de pago (Mercado Pago/Stripe), CRM o cualquier sistema interno que ya estés utilizando.',

      'cta.badge': '¿Listo para dar el siguiente paso?',
      'cta.title': 'Converti tu idea en <span class="text-gradient">software</span>',
      'cta.subtitle': 'Desde sitios web increibles hasta automatizaciones complejas. Estamos listos para construir la solución que tu negocio necesita.',
      'cta.btn': 'Comenzar proyecto',

      'footer.claim': 'Desarrollamos webs, automatizaciones y sistemas a medida para empresas y emprendimientos.',
      'footer.sitemap': 'Mapa del Sitio',
      'footer.inicio': 'Inicio',
      'footer.sobre': 'Sobre Nosotros',
      'footer.servicios': 'Servicios',
      'footer.portfolio': 'Portfolio',
      'footer.social': 'Redes Sociales',
      'footer.rights': 'Vestra. Todos los derechos reservados.',
      'footer.privacy': 'Privacidad',
      'footer.terms': 'Términos'
    },
    en: {
      'nav.inicio': 'Home',
      'nav.sobre': 'About Us',
      'nav.servicios': 'Services',
      'nav.portfolio': 'Portfolio',
      'nav.cta': 'Start Project',

      'hero.badge': 'Software development agency',
      'hero.title1': 'Turn your idea into ',
      'hero.title2': 'software your business needs.',
      'hero.subtitle': 'Web, internal systems and AI. We build what your business needs to grow.',
      'hero.card1.t': 'Websites',
      'hero.card1.d': 'Turn visits into customers',
      'hero.card2.t': 'Internal Systems',
      'hero.card2.d': 'Optimize and manage your company',
      'hero.card3.t': 'AI & Automation',
      'hero.card3.d': 'ELIMINATE REPETITIVE TASKS AND OPTIMIZE YOUR TIME',
      'hero.btn1': 'START PROJECT',
      'hero.btn2': 'VIEW SERVICES',

      'feature.1': '+28 Completed Projects',
      'feature.2': '100% SATISFIED CLIENTS',
      'feature.3': '24/7 Support',

      'about.badge': 'GET TO KNOW US',
      'about.title': 'WE EMPOWER BUSINESSES WITH <span class="about-title-highlight">TECHNOLOGY.</span>',
      'about.desc': 'At <strong>Vestra</strong> we build custom websites, automations and systems for companies and ventures. With over 3 years of experience, we combine technical expertise and a strategic focus to create products aligned with each client\'s goals.',
      'about.li1': '<strong>Delivery in 3 to 6 weeks</strong> — we meet the agreed deadlines',
      'about.li2': '<strong>Your own code, no third-party lock-in</strong> — you own what we build',
      'about.li3': '<strong>Active post-launch support</strong> — we keep supporting you after delivery',
      'about.stat1': 'Successful projects',
      'about.stat2num': '3 to 6 wks',
      'about.stat2': 'Delivery time',
      'about.stat3': 'We answer your inquiry',

      'proceso.badge': 'HOW WE WORK',
      'proceso.title': 'Your project, step by step',
      'proceso.s1.label': 'STEP 1',
      'proceso.s1.t': 'First meeting',
      'proceso.s1.d': 'We understand your idea, goals and needs with no commitment. We listen to what you want to achieve.',
      'proceso.s2.label': 'STEP 2',
      'proceso.s2.t': 'Proposal and quote',
      'proceso.s2.d': 'Clear scope, timelines and a fixed price. No surprises, no hidden costs.',
      'proceso.s3.label': 'STEP 3',
      'proceso.s3.t': 'Design and approval',
      'proceso.s3.d': 'We show you the design before coding. We refine it until you love it.',
      'proceso.s4.label': 'STEP 4',
      'proceso.s4.t': 'Development with updates',
      'proceso.s4.d': 'We build your project with weekly deliveries and feedback. You always know where we stand.',
      'proceso.s5.label': 'STEP 5',
      'proceso.s5.t': 'Launch',
      'proceso.s5.d': 'We put everything into production, optimized and ready to use from day one.',
      'proceso.s6.label': 'STEP 6',
      'proceso.s6.t': 'Ongoing support',
      'proceso.s6.d': 'We stay with you after delivery: support, improvements and new ideas.',
      'proceso.cta': 'Start project',

      'services.title': 'Our Services',
      'services.subtitle': 'Elite software solutions designed to scale your business.',
      'svc1.tag': '01. WEB',
      'svc1.t': 'Websites',
      'svc1.d': 'We build fast websites designed to deliver an excellent user experience and turn visits into customers.',
      'svc1.f1': 'Simple, intuitive navigation',
      'svc1.f2': 'Smooth experience on every device',
      'svc1.f3': 'Turn visits into real customers',
      'svc2.tag': '02. SYSTEMS',
      'svc2.t': 'Internal Systems',
      'svc2.d': 'We develop custom internal systems to optimize management and drive your company\'s growth.',
      'svc2.f1': 'Full control of stock, sales and revenue',
      'svc2.f2': 'Management panel for staff and admins',
      'svc2.f3': 'Secure, centralized data at all times',
      'svc3.tag': '03. AI & AUTO',
      'svc3.t': 'Automations',
      'svc3.d': 'Automate repetitive tasks and let smart systems work for you, saving time and resources.',
      'svc3.f1': 'Automatic replies 24/7',
      'svc3.f2': 'Automation of repetitive tasks',
      'svc3.f3': 'Time savings on daily processes',

      'portfolio.title': 'Our Work',
      'portfolio.subtitle': 'Real projects that drive impact, efficiency and growth.',
      'port1.t': 'Subaru Dealership',
      'port1.d': 'Corporate website for an official Subaru and Suzuki dealership. Vehicle catalog, quick WhatsApp inquiries and premium brand management.',
      'port.link': 'View project',
      'port2.t': 'BitFlow Exchange',
      'port2.d': 'Cryptocurrency exchange platform with trading, wallet, swap and real-time market monitoring.',
      'port.nda': 'Project under a confidentiality agreement',
      'port3.t': 'WhatsApp Automation',
      'port3.d': 'Automation system for WhatsApp Business: automatic replies, catalog integration and promotional campaign management.',

      'clients.title': 'Companies that trust us',
      'clients.subtitle': 'Over 28 successful projects back our track record.',

      'reach.badge': 'INTERNATIONAL PRESENCE',
      'reach.title': 'Global <span class="text-gradient">Reach</span>',
      'reach.desc': 'Borderless software solutions, with a strategic presence in key markets across Latin America and Europe.',
      'reach.s1': 'Countries',
      'reach.s2': 'Continents',
      'reach.s3': 'Global Support',
      'reach.s4': 'IT Projects',

      'faq.tag': 'Frequently Asked Questions',
      'faq.title': 'We answer your questions',
      'faq.q1': 'How long does it take to develop software?',
      'faq.a1': 'Development time varies with complexity, but most of our projects (premium websites, internal systems or automations) are completed within <strong>3 to 6 weeks</strong>.',
      'faq.q2': 'Do I own the code?',
      'faq.a2': 'Absolutely. Once the project is finished and paid for, we hand over full ownership of the source code and all the technical documentation needed. At Vestra we build assets for your business, not dependencies.',
      'faq.q3': 'Do you offer post-launch support?',
      'faq.a3': 'Yes. We offer post-launch support and maintenance plans to keep your software updated, secure and running at 100% capacity.',
      'faq.q4': 'What technologies do you use?',
      'faq.a4': 'We use a modern, scalable tech stack, including <strong>React, Next.js, Node.js and cloud services (AWS/Google Cloud)</strong>. We pick the tool that best fits your business goals.',
      'faq.q5': 'Can you integrate with my current systems?',
      'faq.a5': 'Of course. We specialize in connecting your software with third-party tools such as WhatsApp API, payment gateways (Mercado Pago/Stripe), CRM or any internal system you already use.',

      'cta.badge': 'Ready to take the next step?',
      'cta.title': 'Turn your idea into <span class="text-gradient">software</span>',
      'cta.subtitle': 'From stunning websites to complex automations. We\'re ready to build the solution your business needs.',
      'cta.btn': 'Start project',

      'footer.claim': 'We build custom websites, automations and systems for companies and ventures.',
      'footer.sitemap': 'Sitemap',
      'footer.inicio': 'Home',
      'footer.sobre': 'About Us',
      'footer.servicios': 'Services',
      'footer.portfolio': 'Portfolio',
      'footer.social': 'Social Media',
      'footer.rights': 'Vestra. All rights reserved.',
      'footer.privacy': 'Privacy',
      'footer.terms': 'Terms'
    }
  };

  const STORE_KEY = 'vestra_lang';

  function applyLang(lang) {
    const dict = translations[lang] || translations.es;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.documentElement.setAttribute('lang', lang);
    // Estado del selector
    document.querySelectorAll('.lang-current').forEach(function (c) {
      c.textContent = lang.toUpperCase();
    });
    document.querySelectorAll('.lang-option').forEach(function (opt) {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    const switcher = document.getElementById('langSwitcher');

    // Idioma inicial: guardado > por defecto ES
    let saved = 'es';
    try { saved = localStorage.getItem(STORE_KEY) || 'es'; } catch (e) {}
    applyLang(saved);

    if (!switcher) return;
    const trigger = switcher.querySelector('.lang-trigger');

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = switcher.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    switcher.querySelectorAll('.lang-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        applyLang(opt.getAttribute('data-lang'));
        switcher.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar al clickear afuera
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#langSwitcher')) {
        switcher.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();
