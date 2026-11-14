// All site content lives here. Edit this file to update the portfolio.

export const profile = {
  name: 'Manu Sharma',
  initials: 'MS',
  role: 'Java Full Stack Developer',
  location: 'Punjab, India',
  availability: 'Open to new opportunities',
  // Optional. If set (e.g. 'Immediate', '30 days'), the chat assistant answers notice-period questions.
  noticePeriod: '',
  email: 'manu66449@gmail.com',
  github: 'https://github.com/manu-javadev',
  githubLabel: 'github.com/manu-javadev',
  linkedin: 'https://www.linkedin.com/in/manusharma-javadev',
  linkedinLabel: 'linkedin.com/in/manusharma-javadev',
  resume: '/resume.pdf',
  // Third-person summary used by the chat assistant.
  bio: 'She builds secure, event-driven backends with Java and Spring Boot, and React + TypeScript frontends on top of them, for enterprise platforms in healthcare procurement, university fundraising, vehicle titling, and medical devices.',
  lede:
    'I build secure, event-driven backends with Java and Spring Boot, and fast React + TypeScript frontends on top of them, for enterprise platforms in healthcare, fundraising, and vehicle titling.',
}

export const stats = [
  { value: '6+', label: 'Years building enterprise web apps' },
  { value: '3', label: 'Enterprise client platforms at Netsmartz' },
  { value: 'AWS + Azure', label: 'Cloud deployments with Docker & CI/CD' },
  { value: 'Zero', label: 'Data loss on payouts, using retries + DLQs' },
]

export const about =
  "I'm a full stack developer with 6+ years of experience across healthcare procurement, university fundraising, vehicle titling, and medical devices. I like owning a feature end to end: the Spring Boot service, the data layer, the security around it, and the React screen people actually use. I also enjoy modernizing legacy code, from CoffeeScript modules to monolithic procurement suites, and I use AI-assisted development (GitHub Copilot, Claude, ChatGPT) to build and debug faster."

export const focusAreas = [
  {
    icon: 'server',
    title: 'Backend & APIs',
    text: 'Spring Boot microservices and REST APIs with Hibernate/JPA data layers, plus RabbitMQ and Kafka messaging with retries and dead letter queues.',
  },
  {
    icon: 'layout',
    title: 'Frontend',
    text: 'React and TypeScript apps with Redux Toolkit, AG Grid and Vite, including a micro-frontend architecture for a large procurement suite.',
  },
  {
    icon: 'shield',
    title: 'Security & Cloud',
    text: 'Spring Security, JWT with refresh token rotation, RBAC and Entra ID SSO, shipped with Docker and GitHub Actions to AWS and Azure.',
  },
]

export const experience = [
  {
    role: 'Senior Software Engineer',
    company: 'Netsmartz',
    location: 'Chandigarh, India',
    dates: '04/2021 – Present',
    current: true,
    summary:
      'Full stack developer on three enterprise client platforms: ChampTitles (vehicle titling), Evertrue (university fundraising), and Mohawk Medbuy (healthcare procurement).',
    bullets: [
      'Built Java and Spring Boot services and REST APIs with JPA and MongoDB, updating backend logic as business requirements changed.',
      'Developed React and TypeScript features on these APIs and built Jasper reports, with services running in Docker on AWS.',
      'Core engineer modernizing a legacy Procure-to-Pay suite into a scalable React micro-frontend architecture on Azure, secured with Entra ID SSO and RBAC.',
      "Review teammates' pull requests and fix bugs across frontend and backend code.",
    ],
    tags: ['Java', 'Spring Boot', 'JPA', 'MongoDB', 'React', 'TypeScript', 'Docker', 'AWS', 'Azure'],
  },
  {
    role: 'Java Developer',
    company: 'Clarity Medical Pvt. Ltd.',
    location: 'Mohali, India',
    dates: '07/2020 – 03/2021',
    summary:
      'Built internal software for a medical device manufacturer (ECG, EEG, and patient monitoring devices).',
    bullets: [
      'Developed REST APIs and backend business logic with Java, Spring Boot, and Hibernate.',
      'Wrote SQL queries and Hibernate entity mappings for the data layer.',
      'Built reports for internal teams with Jasper Reports.',
    ],
    tags: ['Java', 'Spring Boot', 'Hibernate', 'SQL', 'Jasper Reports'],
  },
  {
    role: 'Intern, Software Development',
    company: 'Etasens',
    location: 'Chandigarh, India',
    dates: '12/2019 – 07/2020',
    summary:
      'Worked on StarTMS, a test management system for schools and colleges with online tests, online classes, and endowment management.',
    bullets: [
      'Built REST APIs and backend features with Java, Spring Boot, and Hibernate.',
      'Developed Angular UI components and connected them to the backend APIs.',
    ],
    tags: ['Java', 'Spring Boot', 'Hibernate', 'Angular'],
  },
]

export const featuredProject = {
  name: 'FlowPulse',
  tagline: 'Payout & Batch Processing Platform',
  description:
    'A microservices payout platform in Java 17 and Spring Boot for secure CSV ingestion, multi-level approvals, and high-volume financial transactions.',
  impact:
    'Fault-tolerant bank gateway calls with zero data loss: failed payouts retry with exponential backoff, then land in a dead letter queue instead of disappearing.',
  flow: [
    { title: 'CSV Upload', sub: 'React wizard' },
    { title: 'Ingest & Approve', sub: 'Multi-level approvals' },
    { title: 'RabbitMQ', sub: 'Event queue', accent: true },
    { title: 'Payout Service', sub: 'Spring Retry · backoff' },
    { title: 'Bank Gateway', sub: 'External API' },
  ],
  fallback: { title: 'Dead Letter Queue', sub: 'Retries exhausted, nothing lost' },
  bullets: [
    'Event-driven processing with RabbitMQ, Spring Retry (exponential backoff), and Dead Letter Queues.',
    'Spring Security with stateless JWT authentication, refresh token rotation, and role-based access control.',
    'Fixed N+1 query problems and Hibernate lazy-loading errors with DTO mapping.',
    'React + TypeScript (Vite) frontend with multi-step wizards and live dashboards, shipped through GitHub Actions to Docker on AWS (S3, CloudFront, CloudWatch).',
  ],
  tags: ['Java 17', 'Spring Boot', 'Spring Security', 'Spring Cloud', 'PostgreSQL', 'RabbitMQ', 'React', 'Docker', 'AWS'],
  // TODO: replace with the FlowPulse repository URL
  link: 'https://github.com/manu-javadev',
}

export const projects = [
  {
    name: 'Mohawk Medbuy (QwantifyP2P)',
    tagline: 'Procure-to-Pay Modernization',
    context: 'Netsmartz · Healthcare procurement',
    wide: true,
    description:
      'Rebuilt a legacy Procure-to-Pay suite as a set of React micro-frontends on Azure, with single sign-on and role-based access across every app.',
    modules: [
      { name: 'Hub & Security', text: 'Central app gateway and organization module with Entra ID (MSAL) SSO, RBAC, and secure API token routing across all micro-frontends.' },
      { name: 'eReq', text: 'Hospital ordering app using Redux Toolkit for drafts, reusable templates, and multi-level approval chains.' },
      { name: 'Approver Matrix', text: 'Rules engine for complex signing hierarchies, with bulk updates and validation that blocks conflicts before they reach the API.' },
      { name: 'FileViewer & Analytics', text: 'AG Grid Enterprise tracker for large procurement and invoice data, with real-time updates, advanced filtering, and export for auditors.' },
    ],
    tags: ['React 19', 'TypeScript', 'Redux Toolkit', 'AG Grid', 'Azure', 'Entra ID'],
  },
  {
    name: 'Evertrue',
    tagline: 'Fundraising & Donor Engagement',
    context: 'Netsmartz · University fundraising',
    description:
      'Feature work across the Spring Boot backend and React frontend of a large-scale fundraising platform, focused on communication workflows and donor management.',
    bullets: [
      'Rich text email system with Quill.js: signatures, attachments, and scheduled asynchronous sending.',
      'Led a legacy modernization, refactoring large CoffeeScript modules into modern JavaScript.',
    ],
    tags: ['Java', 'Spring Boot', 'React', 'JavaScript', 'CoffeeScript', 'Quill.js'],
  },
  {
    name: 'ChampTitles',
    tagline: 'Digital Vehicle Titling',
    context: 'Netsmartz · SaaS',
    description:
      'Backend services in a large Spring Boot codebase for a platform that digitizes vehicle titling between states, insurers, lenders, dealers, and customers.',
    bullets: [
      'Backend services and REST APIs with Spring Boot, JPA, and MongoDB.',
      'Automated legal vehicle title generation and official documents with Jasper Reports.',
    ],
    tags: ['Java', 'Spring Boot', 'JPA', 'MongoDB', 'React', 'TypeScript', 'Jasper Reports', 'Docker', 'AWS'],
  },
]

// `core` skills are highlighted.
export const skillGroups = [
  { title: 'Languages', items: ['Java 17', 'SQL', 'TypeScript', 'JavaScript'], core: ['Java 17', 'TypeScript'] },
  { title: 'Backend', items: ['Spring Boot', 'Spring Cloud', 'Spring AOP', 'Spring Retry', 'Hibernate', 'JPA', 'REST APIs', 'Microservices', 'JSP & Servlets'], core: ['Spring Boot', 'Hibernate', 'Microservices'] },
  { title: 'Frontend', items: ['React 19', 'Redux Toolkit', 'AG Grid', 'Quill.js', 'Vite', 'MUI', 'Bootstrap', 'CoffeeScript'], core: ['React 19', 'Redux Toolkit'] },
  { title: 'Security', items: ['Spring Security', 'JWT', 'Refresh Token Rotation', 'RBAC', 'Entra ID SSO (MSAL)'], core: ['Spring Security', 'JWT'] },
  { title: 'Messaging', items: ['RabbitMQ', 'Apache Kafka', 'Dead Letter Queues'], core: ['RabbitMQ'] },
  { title: 'Databases', items: ['MySQL', 'PostgreSQL', 'MongoDB'], core: ['PostgreSQL'] },
  { title: 'Cloud & DevOps', items: ['AWS S3', 'CloudFront', 'CloudWatch', 'Azure', 'Docker', 'GitHub Actions', 'CI/CD'], core: ['AWS S3', 'Docker'] },
  { title: 'Tools', items: ['Git', 'GitHub', 'JIRA', 'Flyway', 'Jasper Reports', 'Agile / Scrum'], core: [] },
  { title: 'AI Tools', items: ['GitHub Copilot', 'Claude', 'ChatGPT', 'Agentic AI workflows'], core: [] },
]

export const education = [
  {
    title: 'B.Tech, Electronics & Communication Engineering',
    place: 'Lyallpur Khalsa College of Engineering, Jalandhar',
    year: '2019',
  },
  {
    title: 'Industrial Training in Java',
    place: 'CETPA Infotech Pvt. Ltd., Noida',
    year: '2019',
  },
]
