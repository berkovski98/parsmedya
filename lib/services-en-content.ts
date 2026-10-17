/**
 * Service-specific English copy (Ö6). Each entry is translated from that service's own Turkish
 * description and FAQ so the 22 English service pages no longer share the same paragraphs and
 * questions. Keyed by the Turkish service slug.
 */
export type EnglishServiceCopy = {
  /** Two paragraphs shown after the short description in the overview. */
  paragraphs: [string, string]
  /** Service-specific questions; a timing question and a support question are appended. */
  faqs: { question: string; answer: string }[]
}

export const ENGLISH_SERVICE_COPY: Record<string, EnglishServiceCopy> = {
  'web-sitesi-gelistirme': {
    paragraphs: [
      'We build corporate websites that load quickly, present your brand clearly and are structured for search engines from the first page template.',
      'A modern stack and an easy-to-use content panel let your team update pages, images and news without technical help, while the site scales as your content grows.',
    ],
    faqs: [
      { question: 'How long does a corporate website take?', answer: 'Depending on scope, a corporate website usually goes live in three to six weeks. We share a clear timeline after the discovery meeting.' },
      { question: 'Can we update the website ourselves?', answer: 'Yes. We deliver a user-friendly management panel so content, images and pages can be edited without technical knowledge.' },
      { question: 'Can you redesign our existing website?', answer: 'Yes. We analyse the current site and move it to a modern platform while preserving the content you want to keep.' },
    ],
  },
  'mobil-uygulama': {
    paragraphs: [
      'We design and build fluid, user-focused mobile apps for iOS and Android with performance close to native.',
      'A single codebase keeps the experience consistent on both platforms and reduces the cost and time of every new release.',
    ],
    faqs: [
      { question: 'Do you build for both iOS and Android?', answer: 'Yes. We publish to both platforms from a single codebase, which significantly reduces cost and development time.' },
      { question: 'Do you manage the App Store and Google Play submission?', answer: 'Yes. We manage store publishing end to end and help with the required developer accounts and certificates.' },
      { question: 'How are updates handled after launch?', answer: 'Our maintenance plans cover bug fixes, new features and platform updates on a regular schedule.' },
    ],
  },
  'e-ticaret-cozumleri': {
    paragraphs: [
      'We set up e-commerce stores that are ready to sell, with secure payments and an administration panel your team can run day to day.',
      'Products, orders and customers are managed from one place, and the store can be connected to the payment, shipping and marketplace services you already use.',
    ],
    faqs: [
      { question: 'Which payment methods can you integrate?', answer: 'We integrate a wide range of options, from local virtual POS providers to international payment services.' },
      { question: 'Can the store be connected to marketplaces?', answer: 'Yes. We synchronize stock and orders with marketplaces such as Trendyol and Hepsiburada.' },
      { question: 'Can you migrate our current store?', answer: 'Yes. Existing product, customer and order data can be moved to the new platform without loss.' },
    ],
  },
  'seo-dijital-pazarlama': {
    paragraphs: [
      'We combine technical SEO, content and paid campaigns into one plan aimed at qualified visibility rather than vanity traffic.',
      'Decisions are based on data: we track rankings, conversions and spend so the budget goes where it produces measurable results.',
    ],
    faqs: [
      { question: 'When will we see SEO results?', answer: 'SEO is a long-term investment; the first meaningful results usually appear within three to six months. Paid campaigns produce results much faster.' },
      { question: 'Is the advertising budget included?', answer: 'Our fee covers management. The advertising budget is set separately and spent directly on the ad platforms.' },
      { question: 'How often do we receive reports?', answer: 'We provide detailed monthly reports, and performance can be followed at any time through live dashboards.' },
    ],
  },
  'ui-ux-tasarim': {
    paragraphs: [
      'We design interfaces that reflect your brand, are easy to use and are built to convert, with every design decision tied to user behaviour and business goals.',
      'Research, information architecture, prototypes and usability tests come before visual polish, so the final design solves the right problem.',
    ],
    faqs: [
      { question: 'In which tool are designs delivered?', answer: 'Designs are delivered in Figma, including developer-ready components and a style guide.' },
      { question: 'Can you redesign our existing product?', answer: 'Yes. We review the product for usability and carry out a data-informed redesign.' },
      { question: 'Can design and development be combined?', answer: 'Yes. We offer end-to-end delivery from design to development so the process is managed by one team.' },
    ],
  },
  'yazilim-danismanligi': {
    paragraphs: [
      'We help teams build sustainable systems through technical audits, cloud architecture and ongoing engineering support.',
      'Our role can range from guiding your developers and improving delivery processes to contributing code directly when a project needs extra capacity.',
    ],
    faqs: [
      { question: 'Can you work alongside our own development team?', answer: 'Yes. We mentor your team, improve your processes and contribute to development directly when needed.' },
      { question: 'Which cloud providers do you work with?', answer: 'We have experience with modern cloud platforms, especially AWS and Vercel, and recommend the option that fits your needs.' },
      { question: 'Do you provide support for urgent incidents?', answer: 'Our managed support plans include 24/7 monitoring and incident response.' },
    ],
  },
  'web-yazilim-gelistirme': {
    paragraphs: [
      'Unlike a website that mainly presents content, web software handles sign-in, data, permissions, business rules and integrations: management panels, customer and dealer portals, reservation and order systems.',
      'We plan responsive interfaces, role-based access, APIs, performance and security from the start so a multi-user application stays maintainable as usage grows.',
    ],
    faqs: [
      { question: 'What is the difference between a website and web software?', answer: 'A website mostly presents content. Web software is a dynamic system that processes transactions using users, data, roles, business rules and integrations.' },
      { question: 'Can we have multiple users with different permissions?', answer: 'Yes. The data each role can see and the actions it can take are defined in detail, and critical actions can be logged.' },
    ],
  },
  'ozel-yazilim-gelistirme': {
    paragraphs: [
      'Packaged products cover standard needs, but the workflows that give an organization its edge rarely fit them. Custom development shapes the system around your business instead.',
      'We combine dashboards, permissions, integrations and automation in one architecture, reducing unnecessary licences and manual work.',
    ],
    faqs: [
      { question: 'When is custom software a better choice than an off-the-shelf product?', answer: 'When your processes create a competitive advantage, require many manual workarounds, or when the product’s licence model is not sustainable.' },
      { question: 'How are source code and ownership handled?', answer: 'Delivery, usage and intellectual property terms are defined clearly in the contract at the start of the project.' },
    ],
  },
  'crm-yazilim-cozumleri': {
    paragraphs: [
      'A CRM brings the full history of each commercial relationship into one platform: customer and company records, leads, opportunities, proposals and orders.',
      'A custom CRM follows your sales terminology, approval steps, proposal structure and integrations, focusing on the flows your team actually uses instead of unused fields.',
    ],
    faqs: [
      { question: 'What is the main difference between an off-the-shelf CRM and a custom CRM?', answer: 'An off-the-shelf CRM is shaped around generic processes; a custom CRM directly supports your terminology, sales stages, permissions and existing system connections.' },
      { question: 'Can existing customer data be moved to the new CRM?', answer: 'Yes. After reviewing data quality we migrate through mapping, cleansing, a trial import and validation.' },
    ],
  },
  'erp-yazilim-cozumleri': {
    paragraphs: [
      'An ERP brings sales, purchasing, stock and warehouse, accounts, suppliers, production and branches under one system with a shared data model.',
      'A change to an order flows to the related stock, operations and financial records in a controlled way, so the whole operation becomes traceable.',
    ],
    faqs: [
      { question: 'Does an ERP have to cover every department at once?', answer: 'No. You can start with priority processes and move in phases, with the data model and architecture prepared for later modules.' },
      { question: 'Do we have to replace our accounting software?', answer: 'In most cases, no. Where suitable connection options exist, controlled data exchange can be set up between the ERP and your accounting system.' },
    ],
  },
  'e-ticaret-yazilimi': {
    paragraphs: [
      'For us e-commerce is more than a storefront and a cart: product data, pricing rules, stock, orders, payments, shipping and customer service are parts of one operation.',
      'We tailor catalogue, membership, campaign and checkout experiences to B2C, B2B or hybrid models and connect orders to ERP, CRM, marketplaces and carriers.',
    ],
    faqs: [
      { question: 'When do we need a custom platform instead of a packaged e-commerce product?', answer: 'When you have special pricing, heavy integrations, a different order flow or a customer experience that packaged solutions restrict.' },
      { question: 'Can marketplaces and carriers be integrated?', answer: 'Yes. Depending on each provider’s API, products, stock, orders, labels and tracking can be integrated.' },
    ],
  },
  'kurumsal-web-uygulamalari': {
    paragraphs: [
      'Enterprise web applications give employees, managers and business partners browser-based access to shared processes such as intranet tools, requests and document flows.',
      'Central identity, audit trails, responsive use and integrations with existing systems create a digital workplace that IT can actually govern.',
    ],
    faqs: [
      { question: 'Can access be limited to the company network?', answer: 'Yes. Identity providers, VPN, IP policies or multi-factor authentication can be applied according to your security approach.' },
      { question: 'Can the application be used on mobile devices?', answer: 'Yes. With a responsive interface, suitable workflows can be used securely on phones and tablets.' },
    ],
  },
  'mobil-uygulama-gelistirme': {
    paragraphs: [
      'Mobile products give customers, employees or field teams the action they need at the right moment, so we design user flows, offline needs, notifications and device features around product goals.',
      'Backend services, an admin panel, analytics and store publishing are handled end to end alongside the app itself.',
    ],
    faqs: [
      { question: 'Should we choose native or cross-platform?', answer: 'It depends on device capabilities, performance expectations, your team and the product roadmap. We recommend the approach after analysis.' },
      { question: 'Do you handle store publishing?', answer: 'Yes. We support account setup, packaging, testing and the store review steps.' },
    ],
  },
  'api-sistem-entegrasyonlari': {
    paragraphs: [
      'Integrations remove repeated data entry across applications and let processes move forward automatically when events happen.',
      'We connect payments, ERP, CRM, accounting, SMS, email, shipping, marketplaces, banks and maps with error handling, retries, audit logs and data mapping rules.',
    ],
    faqs: [
      { question: 'Can legacy systems without an API be integrated?', answer: 'Database access, file transfer or other methods offered by the provider are reviewed for security and data integrity before we choose the approach.' },
      { question: 'How are integration errors tracked?', answer: 'Transaction logs, error queues, retry rules and alerts make failed flows visible and manageable.' },
    ],
  },
  'is-surecleri-otomasyonu': {
    paragraphs: [
      'Process automation digitizes rule-based, repetitive tasks so they need less manual effort, from requests and approvals to notifications, documents and data transfers.',
      'We model each flow with its process owners and keep exceptions and control points in place, gaining speed and traceability without losing oversight.',
    ],
    faqs: [
      { question: 'Which processes are suitable for automation?', answer: 'Repetitive processes with clear rules and measurable inputs and outputs are good candidates. We start with a value and risk analysis.' },
      { question: 'Is human approval removed completely?', answer: 'No. Human control can be kept for risky, exceptional or judgement-based steps.' },
    ],
  },
  'b2b-b2c-platform-gelistirme': {
    paragraphs: [
      'B2B and B2C platforms bring different user groups together around products, services, content or transactions.',
      'Catalogue, pricing, membership, order, request and commission rules are designed per segment, while security, performance, payments and integrations are handled by a scalable architecture.',
    ],
    faqs: [
      { question: 'Can B2B and B2C run on the same platform?', answer: 'Yes. Shared product and operations data is kept while pricing, payment, registration and experience rules differ by user type.' },
      { question: 'Can the platform be prepared for high traffic?', answer: 'Yes. Capacity targets, caching, queues and observability are planned up front so the platform can scale step by step.' },
    ],
  },
  'saas-yazilim-gelistirme': {
    paragraphs: [
      'A SaaS product serves many customers over the internet while keeping each organization’s data and settings securely separated.',
      'We design multi-tenancy, subscriptions, plans, payments, roles and usage limits together with the business model, plus the onboarding and operations tools needed to run the product.',
    ],
    faqs: [
      { question: 'Why does multi-tenant architecture matter?', answer: 'It separates each customer’s data and settings securely while letting the shared infrastructure be managed efficiently.' },
      { question: 'Are subscriptions and payments included?', answer: 'With a suitable payment provider, plans, billing, renewals and status notifications can be built into the product flow.' },
    ],
  },
  'dashboard-raporlama-sistemleri': {
    paragraphs: [
      'Dashboards combine operational and performance data from different sources into shared indicators.',
      'KPI definitions, filters, role-based views, period comparisons and exports are designed around real decisions, reducing the effort of manual reporting.',
    ],
    faqs: [
      { question: 'Can data be shown in real time?', answer: 'Depending on the source systems and the business need, real-time, near real-time or scheduled updates can be used.' },
      { question: 'Can our Excel reports be moved into the system?', answer: 'Yes. Calculations and data sources of existing reports are reviewed and turned into a central, repeatable structure.' },
    ],
  },
  'musteri-bayi-portali': {
    paragraphs: [
      'Portals give customers and dealers access to the information and actions they need, under your organization’s rules.',
      'Orders, stock, pricing, quotes, requests, documents and account screens are organized per user segment and kept consistent with ERP and CRM through integrations.',
    ],
    faqs: [
      { question: 'Can each dealer see different prices?', answer: 'Yes. Company, group, contract or campaign-based pricing and discount rules can be applied.' },
      { question: 'Can portal data come from our ERP?', answer: 'Yes. With a suitable integration, product, stock, price, order and document data can stay in sync with the ERP.' },
    ],
  },
  'stok-siparis-yonetim-sistemleri': {
    paragraphs: [
      'Inventory and order systems track every movement of a product from receipt to reservation, picking, shipment and return.',
      'Multiple warehouses, transfers, stock counts, reorder levels and serial or lot tracking are modelled on your operation and connected to sales channels, ERP, carriers and accounting.',
    ],
    faqs: [
      { question: 'Are barcodes or serial numbers supported?', answer: 'Yes. Barcode, serial or lot-based tracking and scanning flows can be added depending on your business model.' },
      { question: 'Can stock across several sales channels be managed?', answer: 'Depending on integration options, stock and order data from each channel can be connected to the central system.' },
    ],
  },
  'yapay-zeka-destekli-yazilim': {
    paragraphs: [
      'Matched with the right problem and data, AI can speed up access to knowledge and support content-heavy work such as document analysis, classification, summarization and intelligent search.',
      'We define human review, source citation, access rights and output quality limits, focusing on measurable business goals rather than claims that cannot be verified.',
    ],
    faqs: [
      { question: 'Are AI outputs always correct?', answer: 'No. Depending on the use case, source citation, validation, human approval and quality thresholds have to be designed in.' },
      { question: 'How is company data protected?', answer: 'Data classification, permissions, provider terms and retention policies are assessed before the project, and a suitable architecture is chosen for sensitive data.' },
    ],
  },
  'yazilim-modernizasyonu': {
    paragraphs: [
      'Modernization improves a working system step by step after analysing its risks, dependencies and business priorities, instead of replacing everything at once.',
      'We review code, database, interface, security, performance and deployment, then compare refactoring, modularization, phased renewal or rewrite options.',
    ],
    faqs: [
      { question: 'Does modernization mean rewriting the whole system?', answer: 'Not always. After a technical analysis we compare improvement, modularization, gradual renewal and rewrite options.' },
      { question: 'Will the current system keep running during the transition?', answer: 'Phased migration, parallel running and rollback plans keep the risk of downtime as low as possible.' },
    ],
  },
}

export function englishServiceCopy(trSlug: string): EnglishServiceCopy | undefined {
  return ENGLISH_SERVICE_COPY[trSlug]
}
