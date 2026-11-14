// Answers questions about Manu using only the content in data.js.
// Runs entirely in the browser: no API keys, no network calls.
// If a question can't be answered from the resume, the reply has `handoff: 'unknown'`
// and the UI offers to email Manu instead of guessing.

import { profile, stats, experience, featuredProject, projects, skillGroups, education } from '../data.js'

/* ── Text helpers ──────────────────────────────────── */

export function normalize(s) {
  return (
    ' ' +
    s
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9+#./\s-]+/g, ' ')
      .replace(/-/g, ' ')
      .replace(/[./]+(?=\s|$)/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() +
    ' '
  )
}

const has = (text, phrases) => phrases.some((p) => text.includes(` ${p} `) || (p.endsWith('*') && text.includes(` ${p.slice(0, -1)}`)))

function editDistance(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
  }
  return dp[a.length][b.length]
}

// Aliases found in the text: exact phrases first, else single words within a small typo distance.
function matchedPhrases(text, aliases) {
  const exact = aliases.filter((a) => text.includes(` ${a} `))
  if (exact.length) return exact
  const words = text.trim().split(' ')
  return aliases.filter(
    (a) =>
      !a.includes(' ') &&
      a.length >= 5 &&
      words.some((w) => w.length >= 5 && editDistance(w, a) <= (a.length >= 9 ? 2 : 1)),
  )
}

const mentions = (text, aliases) => matchedPhrases(text, aliases).length > 0

/* ── Knowledge ─────────────────────────────────────── */

const currentJob = experience.find((j) => j.current) || experience[0]
const firstJob = experience[experience.length - 1]
const yearsStat = stats[0]?.value || ''

const allProjects = [featuredProject, ...projects]
const byName = (prefix) => allProjects.find((p) => p.name.toLowerCase().startsWith(prefix))
const jobBy = (prefix) => experience.find((j) => j.company.toLowerCase().startsWith(prefix))

// Names people might use for each project or employer.
const ENTITIES = [
  { ref: byName('flowpulse'), kind: 'project', aliases: ['flowpulse', 'flow pulse', 'payout', 'payouts', 'batch processing'] },
  { ref: byName('mohawk'), kind: 'project', aliases: ['mohawk', 'medbuy', 'qwantify', 'qwantifyp2p', 'procure to pay', 'p2p', 'procurement', 'ereq', 'approver matrix', 'fileviewer'] },
  { ref: byName('evertrue'), kind: 'project', aliases: ['evertrue', 'ever true', 'fundraising', 'donor', 'donors', 'email system', 'email feature', 'emails feature'] },
  { ref: byName('champtitles'), kind: 'project', aliases: ['champtitles', 'champ titles', 'champtitle', 'vehicle titling', 'vehicle title', 'titling'] },
  { ref: jobBy('netsmartz'), kind: 'job', aliases: ['netsmartz', 'net smartz'] },
  { ref: jobBy('clarity'), kind: 'job', aliases: ['clarity', 'clarity medical', 'medical device', 'medical devices', 'ecg', 'eeg'] },
  { ref: jobBy('etasens'), kind: 'job', aliases: ['etasens', 'startms', 'star tms', 'internship', 'intern'] },
].filter((e) => e.ref)

// Technologies on the resume, with the ways people tend to write them.
const TECH = [
  ['Java', ['java', 'java 17', 'java17', 'core java', 'j2ee', 'jdk']],
  ['Spring Boot', ['spring boot', 'springboot', 'spring']],
  ['Spring Security', ['spring security']],
  ['Spring Cloud', ['spring cloud']],
  ['Spring AOP', ['spring aop', 'aop']],
  ['Spring Retry', ['spring retry', 'retry', 'retries', 'exponential backoff', 'backoff']],
  ['Hibernate', ['hibernate', 'orm']],
  ['JPA', ['jpa']],
  ['REST APIs', ['rest', 'rest api', 'rest apis', 'restful', 'api', 'apis']],
  ['Microservices', ['microservices', 'microservice', 'micro services']],
  ['JSP & Servlets', ['jsp', 'servlet', 'servlets']],
  ['SQL', ['sql']],
  ['MySQL', ['mysql']],
  ['PostgreSQL', ['postgresql', 'postgres']],
  ['MongoDB', ['mongodb', 'mongo', 'nosql']],
  ['RabbitMQ', ['rabbitmq', 'rabbit mq', 'rabbit']],
  ['Apache Kafka', ['kafka', 'apache kafka']],
  ['Dead Letter Queues', ['dead letter queue', 'dead letter queues', 'dlq', 'dlqs']],
  ['JWT', ['jwt', 'json web token', 'refresh token', 'refresh tokens']],
  ['RBAC', ['rbac', 'role based access', 'role based access control']],
  ['Entra ID SSO (MSAL)', ['sso', 'single sign on', 'entra', 'entra id', 'msal', 'azure ad', 'active directory']],
  ['AWS', ['aws', 'amazon web services', 's3', 'cloudfront', 'cloudwatch']],
  ['Azure', ['azure', 'microsoft azure']],
  ['Docker', ['docker', 'containers', 'containerization']],
  ['GitHub Actions / CI/CD', ['github actions', 'ci/cd', 'ci cd', 'cicd', 'pipelines', 'pipeline']],
  ['React', ['react', 'reactjs', 'react js', 'react 19']],
  ['TypeScript', ['typescript', 'ts']],
  ['JavaScript', ['javascript', 'js', 'es6']],
  ['Redux Toolkit', ['redux', 'redux toolkit']],
  ['AG Grid', ['ag grid', 'aggrid']],
  ['Quill.js', ['quill', 'quill.js', 'quilljs', 'rich text']],
  ['Vite', ['vite']],
  ['MUI', ['mui', 'material ui']],
  ['Bootstrap', ['bootstrap']],
  ['CoffeeScript', ['coffeescript', 'coffee script']],
  ['Angular', ['angular']],
  ['Micro-frontends', ['micro frontend', 'micro frontends', 'microfrontend', 'microfrontends']],
  ['Jasper Reports', ['jasper', 'jasper reports', 'jasperreports']],
  ['Flyway', ['flyway', 'migrations']],
  ['Git / GitHub', ['git', 'version control']],
  ['JIRA', ['jira']],
  ['Agile / Scrum', ['agile', 'scrum']],
  ['AI-assisted development', ['copilot', 'github copilot', 'chatgpt', 'claude', 'ai tools', 'agentic']],
].map(([name, aliases]) => ({ name, aliases }))

// Common technologies that are NOT on the resume, so the bot can say so honestly.
const NOT_ON_RESUME = [
  'python', 'django', 'flask', 'fastapi', 'node', 'nodejs', 'node.js', 'express.js', 'expressjs', 'golang', 'rust',
  'c#', '.net', 'dotnet', 'php', 'laravel', 'ruby', 'rails', 'kotlin', 'scala', 'c++', 'swift', 'android', 'ios',
  'flutter', 'react native', 'vue', 'vue.js', 'vuejs', 'svelte', 'next.js', 'nextjs', 'nestjs', 'graphql', 'grpc',
  'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'oracle', 'snowflake', 'kubernetes', 'k8s', 'terraform',
  'ansible', 'jenkins', 'gcp', 'google cloud', 'openshift', 'spark', 'hadoop', 'airflow', 'tensorflow', 'pytorch',
  'machine learning', 'salesforce', 'mulesoft', 'sap', 'selenium', 'cypress', 'jest', 'junit', 'mockito', 'tdd',
  'lambda', 'sqs', 'sns', 'ec2', 'eks', 'ecs', 'webflux', 'oauth', 'oauth2', 'keycloak', 'tailwind', 'figma',
]

const PRETTY = { 'c#': 'C#', '.net': '.NET', dotnet: '.NET', k8s: 'Kubernetes', gcp: 'GCP', ios: 'iOS', sqs: 'SQS', sns: 'SNS', ec2: 'EC2', eks: 'EKS', ecs: 'ECS', tdd: 'TDD', sap: 'SAP' }
const pretty = (t) => PRETTY[t] || t.replace(/(^|\s)\S/g, (c) => c.toUpperCase())

/* ── Evidence lookup ───────────────────────────────── */

function entryTexts(entry) {
  return [
    entry.summary,
    entry.description,
    entry.impact,
    ...(entry.bullets || []),
    ...(entry.modules || []).map((m) => `${m.name}: ${m.text}`),
    ...(entry.tags || []),
  ].filter(Boolean)
}

const entryLabel = (e) => (e.company ? `${e.role} at ${e.company}` : e.name)

// Where on the resume a technology shows up, with the first sentence that mentions it.
function evidenceFor(tech) {
  const hits = []
  for (const entry of [...experience, ...allProjects]) {
    const texts = entryTexts(entry)
    const match = texts.find((t) => has(normalize(t), tech.aliases))
    if (!match) continue
    const sentence = texts.find((t) => t.length > 30 && has(normalize(t), tech.aliases))
    hits.push({ label: entryLabel(entry), sentence })
  }
  const group = skillGroups.find((g) => g.items.some((i) => has(normalize(i), tech.aliases)))
  return { hits, group: group?.title }
}

/* ── Answer builders ───────────────────────────────── */

const SUGGEST = {
  start: ["What's her tech stack?", 'Tell me about FlowPulse', 'How many years of experience?', 'Is she open to new roles?'],
  afterTech: ['What projects has she built?', 'What is she doing now?', 'How can I contact her?'],
  afterProject: ['What other projects?', "What's her tech stack?", 'How can I contact her?'],
  afterJob: ['Where else has she worked?', 'What projects has she built?', 'How can I contact her?'],
  general: ["What's her tech stack?", 'What projects has she built?', 'How can I contact her?'],
}

const reply = (text, extra = {}) => ({ text, ...extra })

function projectAnswer(p) {
  const lines = p.modules ? p.modules.map((m) => `**${m.name}**: ${m.text}`) : p.bullets || []
  return reply(`**${p.name}** (${p.tagline})${p.context ? `, ${p.context}` : ''}. ${p.description}${p.impact ? ` ${p.impact}` : ''}`, {
    bullets: lines,
    footnote: `Stack: ${p.tags.join(', ')}`,
    links: p.link ? [{ label: 'View on GitHub', href: p.link }] : undefined,
    suggestions: SUGGEST.afterProject,
  })
}

function jobAnswer(j) {
  return reply(`**${j.role} at ${j.company}** (${j.location}, ${j.dates}). ${j.summary}`, {
    bullets: j.bullets,
    footnote: `Stack: ${j.tags.join(', ')}`,
    suggestions: SUGGEST.afterJob,
  })
}

function techAnswer(known, unknown) {
  const parts = []
  let bullets = []
  let footnote
  if (known.length === 1) {
    const t = known[0]
    const { hits, group } = evidenceFor(t)
    const where = hits.length ? ` She has used it in: ${hits.map((h) => h.label).join(', ')}.` : ''
    parts.push(`Yes, Manu has worked with **${t.name}**.${group ? ` It's listed under her ${group} skills.` : ''}${where}`)
    bullets = hits.filter((h) => h.sentence).slice(0, 3).map((h) => `**${h.label}**: ${h.sentence}`)
    const g = skillGroups.find((x) => x.title === group)
    if (g) footnote = `${g.title}: ${g.items.join(', ')}`
  } else if (known.length > 1) {
    parts.push('Yes, all of these are on her resume:')
    bullets = known.map((t) => {
      const { hits, group } = evidenceFor(t)
      const where = hits.length ? `used in ${hits.slice(0, 3).map((h) => h.label).join(', ')}` : `listed under ${group || 'her skills'}`
      return `**${t.name}**: ${where}`
    })
  }
  if (unknown.length) {
    const names = unknown.map(pretty).join(', ')
    parts.push(`${known.length ? 'However, ' : ''}**${names}** ${unknown.length > 1 ? "aren't" : "isn't"} on Manu's resume, so I can't say how much she has used ${unknown.length > 1 ? 'them' : 'it'}.`)
  }
  return reply(parts.join(' '), {
    bullets,
    footnote,
    handoff: unknown.length ? 'unknown' : undefined,
    suggestions: SUGGEST.afterTech,
  })
}

function groupAnswer(group) {
  return reply(`Her **${group.title}** skills: ${group.items.join(', ')}.`, {
    footnote: group.core?.length ? `Most used: ${group.core.join(', ')}` : undefined,
    suggestions: SUGGEST.afterTech,
  })
}

const handoff = (text) => reply(text, { handoff: 'unknown', suggestions: SUGGEST.general })

/* ── Intents ───────────────────────────────────────── */

const PERSONAL = [
  'salary', 'ctc', 'compensation', 'pay scale', 'salary expectations', 'notice', 'notice period', 'visa',
  'sponsorship', 'relocate', 'relocation', 'remote', 'hybrid', 'onsite', 'on site', 'wfh', 'work from home', 'age',
  'married', 'hobby', 'hobbies', 'reference', 'references', 'rate', 'hourly', 'freelance', 'contract', 'joining',
  'start date', 'when can she start', 'personality', 'weakness', 'weaknesses', 'gender', 'religion',
]

const GROUP_WORDS = {
  Languages: ['programming languages', 'languages', 'language'],
  Backend: ['backend', 'back end', 'server side'],
  Frontend: ['frontend', 'front end', 'ui', 'client side'],
  Security: ['security', 'auth', 'authentication', 'authorization', 'secure'],
  Messaging: ['messaging', 'queues', 'queue', 'event driven', 'events', 'async'],
  Databases: ['database', 'databases', 'db', 'dbs', 'data layer'],
  'Cloud & DevOps': ['cloud', 'devops', 'dev ops', 'deployment', 'deploy', 'infrastructure'],
  Tools: ['tools', 'tooling'],
  'AI Tools': ['ai', 'artificial intelligence', 'llm', 'llms', 'genai'],
}

export function answer(question) {
  const q = normalize(question)
  if (!q.trim()) return reply('Ask me anything about Manu: her skills, projects, or experience.', { suggestions: SUGGEST.start })

  // Small talk
  const greetingOnly = /^ (hi|hello|hey|hii|hiya|yo|good (morning|afternoon|evening)|namaste)( there| manu)? $/.test(q)
  if (greetingOnly) {
    return reply("Hi! I'm Manu's assistant. Ask me about her experience, projects, or skills, and I'll answer from her resume.", { suggestions: SUGGEST.start })
  }
  if (/^ ((ok|okay|great|cool|awesome|perfect|nice) )?(thanks|thank you|thx|ty|great|cool|awesome|perfect|nice|ok|okay|bye|goodbye)( (so much|a lot|again|manu))?( (thanks|bye))? $/.test(q)) {
    return reply("You're welcome! If you'd like to talk to Manu directly, she's one message away.", { handoff: 'contact', suggestions: SUGGEST.general })
  }
  if (q === ' help ' || has(q, ['who are you', 'are you a bot', 'are you human', 'are you real', 'what can you do', 'how does this work'])) {
    return reply(
      "I'm a small assistant that answers questions from Manu's resume: her skills, jobs, projects, and education. If I can't find something, I'll help you email Manu directly.",
      { suggestions: SUGGEST.start },
    )
  }

  // Notice period, if Manu has filled it in (data.js → profile.noticePeriod)
  const notice = profile.noticePeriod
  if (notice && has(q, ['notice', 'notice period', 'joining', 'when can she join', 'when can she start', 'start date', 'how soon', 'serving notice'])) {
    return reply(`Manu's notice period is **${notice}**.`, { handoff: 'contact', suggestions: SUGGEST.general })
  }

  // Questions only Manu can answer
  if (has(q, PERSONAL)) {
    return handoff("That's something Manu would rather discuss with you directly. It isn't on her resume.")
  }

  // Contact & resume
  const contactWords = [
    'contact', 'reach', 'reach her', 'phone', 'phone number', 'mobile', 'mobile number', 'her number', 'contact number',
    'whatsapp', 'call her', 'call manu', 'linkedin', 'get in touch', 'talk to', 'speak to', 'connect with',
    'her email', 'email address', 'email id', 'mail id', 'email her', 'send an email', 'send her an email',
    'github profile', 'github link', 'her github', 'github account', 'github url',
  ]
  if (has(q, contactWords) || /^ (e ?mail|email\?|phone|number) $/.test(q)) {
    const asksPhone = has(q, ['phone', 'phone number', 'mobile', 'mobile number', 'her number', 'contact number', 'whatsapp', 'call her', 'call manu']) || q === ' number '
    const text = asksPhone
      ? `Manu prefers to be contacted by email. You can reach her at **${profile.email}**.`
      : `You can reach Manu by email at **${profile.email}**.`
    return reply(text, {
      handoff: 'contact',
      links: [
        { label: 'LinkedIn', href: profile.linkedin },
        { label: 'GitHub', href: profile.github },
      ],
      suggestions: SUGGEST.start,
    })
  }
  if (has(q, ['resume', 'cv', 'curriculum vitae', 'download'])) {
    return reply("Here's Manu's resume as a PDF.", { links: [{ label: 'Open resume (PDF)', href: profile.resume }], suggestions: SUGGEST.general })
  }
  if (has(q, ['certification', 'certifications', 'certified', 'certificate', 'certificates', 'certs'])) {
    return handoff("Manu's resume doesn't list any certifications, so I can't answer that one.")
  }

  // Specific projects / employers (optionally combined with a technology)
  const entities = ENTITIES.filter((e) => mentions(q, e.aliases))
  const techHits = TECH.map((t) => ({ t, phrases: matchedPhrases(q, t.aliases) })).filter((h) => h.phrases.length)
  const unknownHits = NOT_ON_RESUME.filter((t) => has(q, [t]))
  // Drop a match that is only part of a longer match ("spring" inside "spring security", "react" inside "react native").
  const allPhrases = [...techHits.flatMap((h) => h.phrases), ...unknownHits]
  const covered = (p) => allPhrases.some((o) => o.length > p.length && ` ${o} `.includes(` ${p} `))
  const known = techHits.filter((h) => h.phrases.some((p) => !covered(p))).map((h) => h.t)
  const unknown = unknownHits.filter((u) => !covered(u))
  const asksYears = has(q, ['how many years', 'years of experience', 'how long', 'how experienced', 'experience level', 'seniority', 'senior', 'years'])

  if (entities.length) {
    const e = entities[0]
    const techs = known.filter((t) => !e.aliases.some((a) => t.aliases.includes(a)))
    if (techs.length) {
      const texts = normalize(entryTexts(e.ref).join(' '))
      const yes = techs.filter((t) => has(texts, t.aliases))
      const no = techs.filter((t) => !has(texts, t.aliases))
      const label = entryLabel(e.ref)
      const parts = []
      if (yes.length) parts.push(`Yes, **${yes.map((t) => t.name).join(', ')}** ${yes.length > 1 ? 'are' : 'is'} part of her ${label} work.`)
      if (no.length) parts.push(`Her resume doesn't mention **${no.map((t) => t.name).join(', ')}** for ${label}.`)
      return reply(parts.join(' '), {
        footnote: `${label} stack: ${e.ref.tags.join(', ')}`,
        handoff: no.length ? 'unknown' : undefined,
        suggestions: SUGGEST.afterProject,
      })
    }
    return e.kind === 'project' ? projectAnswer(e.ref) : jobAnswer(e.ref)
  }

  // Experience length / current role / history (checked before generic tech so "java experience" still works below)
  if (asksYears && !known.length && !unknown.length) {
    return reply(
      `Manu has **${yearsStat} years** of professional experience. She started as an intern at ${firstJob.company} (${firstJob.dates.split('–')[0].trim()}) and has been a ${currentJob.role} at **${currentJob.company}** since ${currentJob.dates.split('–')[0].trim()}.`,
      { suggestions: SUGGEST.afterJob },
    )
  }
  if (!known.length && has(q, ['current', 'currently', 'right now', 'now', 'present', 'presently', 'where does she work', 'where is she working', 'employer', 'working at', 'works at', 'work for', 'works for', 'working for', 'current company', 'current job', 'current role'])) {
    return jobAnswer(currentJob)
  }

  // Technologies
  if (known.length || unknown.length) {
    const res = techAnswer(known, unknown)
    if (asksYears && known.length) {
      res.footnote = `Overall she has ${yearsStat} years of experience. Her resume doesn't break that down per technology.`
    }
    return res
  }

  // Skill categories
  for (const [title, words] of Object.entries(GROUP_WORDS)) {
    if (has(q, words)) {
      const group = skillGroups.find((g) => g.title === title)
      if (group) return groupAnswer(group)
    }
  }

  if (has(q, ['lead', 'leader', 'leadership', 'led', 'team', 'teamwork', 'mentor', 'mentoring', 'code review', 'code reviews', 'review', 'reviews', 'collaborat*'])) {
    return reply('A few examples from her resume:', {
      bullets: [
        'Core engineer on the modernization of a legacy Procure-to-Pay suite into React micro-frontends (Mohawk Medbuy).',
        'Led a legacy modernization effort at Evertrue, refactoring large CoffeeScript modules into modern JavaScript.',
        "Reviews teammates' pull requests and fixes bugs across frontend and backend code at Netsmartz.",
      ],
      suggestions: SUGGEST.general,
    })
  }

  if (has(q, ['industry', 'industries', 'domain', 'domains', 'healthcare', 'fintech', 'finance', 'sector', 'sectors'])) {
    return reply('She has built software for several domains:', {
      bullets: [
        '**Healthcare procurement**: Mohawk Medbuy (Procure-to-Pay)',
        '**University fundraising**: Evertrue',
        '**Vehicle titling (SaaS)**: ChampTitles',
        '**Medical devices**: Clarity Medical (ECG, EEG, patient monitoring)',
        '**Payments / payouts**: FlowPulse',
      ],
      suggestions: SUGGEST.general,
    })
  }

  if (has(q, ['available', 'availability', 'open to', 'looking for', 'hire', 'hiring', 'new role', 'new job', 'opportunity', 'opportunities', 'job search', 'job hunting', 'interested in', 'join'])) {
    return reply(`Yes, Manu is **${profile.availability.toLowerCase()}**, especially Java full stack, backend, and React roles. The best next step is to contact her directly.`, {
      handoff: 'contact',
      suggestions: SUGGEST.general,
    })
  }

  if (has(q, ['experience', 'work history', 'worked', 'jobs', 'job', 'career', 'companies', 'company', 'employment', 'previous', 'past roles', 'roles'])) {
    return reply(`Manu has worked at ${experience.length} companies:`, {
      bullets: experience.map((j) => `**${j.role}, ${j.company}** (${j.dates}): ${j.summary}`),
      suggestions: SUGGEST.afterJob,
    })
  }

  if (has(q, ['project', 'projects', 'built', 'build', 'portfolio', 'work samples', 'side project', 'made', 'developed', 'apps', 'applications'])) {
    return reply('Here are the projects on her portfolio:', {
      bullets: allProjects.map((p) => `**${p.name}** (${p.tagline}): ${p.description}`),
      suggestions: ['Tell me about FlowPulse', 'Tell me about Mohawk Medbuy', 'Tell me about Evertrue'],
    })
  }

  if (has(q, ['skills', 'skill', 'stack', 'tech stack', 'technologies', 'technology', 'tech', 'good at', 'strengths', 'strength', 'expertise', 'know', 'proficient', 'expert'])) {
    const main = skillGroups.filter((g) => g.title !== 'Tools' && g.title !== 'AI Tools')
    return reply('Her core stack is **Java 17 + Spring Boot** on the backend and **React + TypeScript** on the frontend. By area:', {
      bullets: main.map((g) => `**${g.title}**: ${g.items.join(', ')}`),
      suggestions: ['Does she know Kafka?', 'What cloud has she used?', 'What projects has she built?'],
    })
  }

  if (has(q, ['education', 'degree', 'college', 'university', 'study', 'studied', 'graduate', 'graduated', 'graduation', 'btech', 'b.tech', 'b tech', 'bachelor', 'bachelors', 'qualification', 'qualifications', 'training', 'school'])) {
    return reply('Her education and training:', {
      bullets: education.map((e) => `**${e.title}**, ${e.place} (${e.year})`),
      suggestions: SUGGEST.general,
    })
  }

  if (has(q, ['where is she', 'based', 'location', 'located', 'live', 'lives', 'city', 'country', 'where is manu', 'from where', 'where does she live'])) {
    return reply(`Manu is based in **${profile.location}**.`, { suggestions: ['Is she open to new roles?', 'How can I contact her?'] })
  }

  if (/^ (manu|manu sharma|about|about her|about manu|tell me more|more) $/.test(q) || has(q, ['who is', 'who is manu', 'about her', 'about manu', 'tell me about her', 'tell me about manu', 'tell me more', 'summary', 'summarize', 'introduce', 'introduction', 'overview', 'profile', 'describe her', 'describe manu', 'background'])) {
    return reply(`**${profile.name}** is a ${profile.role} with ${yearsStat} years of experience. ${profile.bio}`, {
      suggestions: SUGGEST.start,
    })
  }

  return handoff("I couldn't find an answer to that in Manu's resume, and I'd rather not guess.")
}

// Other parts of the page can open the chat with: window.dispatchEvent(new Event(OPEN_EVENT))
export const OPEN_EVENT = 'chatbot:open'

export const WELCOME = reply(
  "Hi! I'm Manu's assistant. Ask me about her experience, projects, or skills, and I'll answer from her resume. If I don't know something, I'll help you email Manu directly.",
  { suggestions: SUGGEST.start },
)
