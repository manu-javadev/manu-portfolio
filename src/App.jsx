import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import Chatbot from './chatbot/Chatbot.jsx'
import {
  profile,
  stats,
  about,
  focusAreas,
  experience,
  featuredProject,
  projects,
  skillGroups,
  education,
} from './data.js'

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

/* ── Hooks ─────────────────────────────────────────── */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return active
}

function useScrolled(offset = 8) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > offset)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])
  return scrolled
}

function getInitialTheme() {
  const set = document.documentElement.dataset.theme
  if (set === 'light' || set === 'dark') return set
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/* ── Small pieces ──────────────────────────────────── */

function Tags({ items, core = [] }) {
  return (
    <ul className="tags" aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className={core.includes(t) ? 'tag tag-core' : 'tag'}>
          {t}
        </li>
      ))}
    </ul>
  )
}

function SectionHead({ index, eyebrow, title, intro }) {
  return (
    <div className="section-head reveal">
      <p className="eyebrow">
        <span>{index}</span> {eyebrow}
      </p>
      <h2>{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  )
}

/* ── Sections ──────────────────────────────────────── */

function Nav() {
  const active = useActiveSection()
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* storage unavailable; theme still applies for this visit */
    }
    setTheme(next)
  }

  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''} ${open ? 'nav-open' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">{profile.initials}</span>
          <span className="brand-name">{profile.name}</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {NAV.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'active' : undefined}
              aria-current={active === id ? 'true' : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <a className="menu-only" href={profile.resume} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            Resume (PDF) ↗
          </a>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <a className="btn btn-small btn-solid nav-resume" href={profile.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
          <button
            type="button"
            className="icon-btn nav-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-copy">
          <p className="status-pill">
            <span className="status-dot" aria-hidden="true" />
            {profile.availability}
          </p>
          <h1>
            <span className="hero-hi">Hi, I&apos;m</span>
            {profile.name}
          </h1>
          <p className="hero-role">{profile.role}</p>
          <p className="hero-lede">{profile.lede}</p>

          <div className="hero-actions">
            <a className="btn btn-solid" href="#projects">
              View my work <Icon name="arrowDown" size={16} />
            </a>
            <a className="btn btn-ghost" href={profile.resume} target="_blank" rel="noreferrer">
              <Icon name="file" size={16} /> Resume
            </a>
            <span className="hero-socials">
              <a className="icon-btn icon-btn-lg" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <Icon name="github" />
              </a>
              <a className="icon-btn icon-btn-lg" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Icon name="linkedin" />
              </a>
            </span>
          </div>

          <p className="hero-location">
            <Icon name="pin" size={15} /> {profile.location}
          </p>
        </div>

        <dl className="stats">
          {stats.map((s) => (
            <div className="stat reveal" key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead index="01" eyebrow="About" title="Backend depth, frontend polish." />
        <div className="about-grid">
          <p className="about-text reveal">{about}</p>
          <div className="focus-list">
            {focusAreas.map((f) => (
              <article className="focus reveal" key={f.title}>
                <span className="focus-icon">
                  <Icon name={f.icon} size={20} />
                </span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section className="section section-alt" id="experience">
      <div className="container">
        <SectionHead index="02" eyebrow="Experience" title="Where I've worked" />
        <ol className="timeline">
          {experience.map((job) => (
            <li className={`tl-item reveal ${job.current ? 'tl-current' : ''}`} key={job.company}>
              <span className="tl-dot" aria-hidden="true" />
              <article className="card tl-card">
                <header className="tl-head">
                  <div>
                    <h3>{job.role}</h3>
                    <p className="tl-company">
                      {job.company} <span>· {job.location}</span>
                    </p>
                  </div>
                  <p className="tl-dates">{job.dates}</p>
                </header>
                <p className="tl-summary">{job.summary}</p>
                <ul className="bullets">
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <Tags items={job.tags} />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function FlowDiagram({ steps, fallback }) {
  return (
    <div className="flow" role="img" aria-label={`Flow: ${steps.map((s) => s.title).join(', then ')}. On failure after retries: ${fallback.title}.`}>
      <div className="flow-steps">
        {steps.map((s) => (
          <div className={`flow-node ${s.accent ? 'flow-node-accent' : ''}`} key={s.title}>
            <strong>{s.title}</strong>
            <span>{s.sub}</span>
          </div>
        ))}
        <div className="flow-node flow-node-fail">
          <strong>{fallback.title}</strong>
          <span>{fallback.sub}</span>
        </div>
      </div>
    </div>
  )
}

function Projects() {
  const p = featuredProject
  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHead index="03" eyebrow="Projects" title="Selected work" />

        <article className="card featured reveal">
          <div className="featured-head">
            <div>
              <p className="kicker">Featured project</p>
              <h3>
                {p.name} <span>— {p.tagline}</span>
              </h3>
              <p className="featured-desc">{p.description}</p>
            </div>
            <a className="btn btn-ghost" href={p.link} target="_blank" rel="noreferrer">
              <Icon name="github" size={16} /> GitHub <Icon name="arrow" size={14} />
            </a>
          </div>

          <FlowDiagram steps={p.flow} fallback={p.fallback} />

          <p className="callout">{p.impact}</p>

          <div className="featured-body">
            <ul className="bullets">
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <Tags items={p.tags} />
          </div>
        </article>

        <div className="project-grid">
          {projects.map((proj) => (
            <article className={`card project reveal ${proj.wide ? 'project-wide' : ''}`} key={proj.name}>
              <p className="kicker">{proj.context}</p>
              <h3>
                {proj.name} <span>— {proj.tagline}</span>
              </h3>
              <p className="project-desc">{proj.description}</p>

              {proj.modules && (
                <div className="modules">
                  {proj.modules.map((m) => (
                    <div className="module" key={m.name}>
                      <h4>{m.name}</h4>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {proj.bullets && (
                <ul className="bullets">
                  {proj.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}

              <Tags items={proj.tags} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section className="section section-alt" id="skills">
      <div className="container">
        <SectionHead index="04" eyebrow="Skills" title="Toolbox" intro="Highlighted items are the ones I use most day to day." />
        <div className="skills-grid">
          {skillGroups.map((g) => (
            <div className="card skill-group reveal" key={g.title}>
              <h3>{g.title}</h3>
              <Tags items={g.items} core={g.core} />
            </div>
          ))}
        </div>

        <h3 className="sub-head reveal">Education &amp; training</h3>
        <div className="edu-grid">
          {education.map((e) => (
            <article className="card edu reveal" key={e.title}>
              <span className="focus-icon">
                <Icon name="cap" size={20} />
              </span>
              <div>
                <h4>{e.title}</h4>
                <p>{e.place}</p>
              </div>
              <span className="edu-year">{e.year}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact-panel reveal">
          <p className="eyebrow eyebrow-on-dark">
            <span>05</span> Contact
          </p>
          <h2>Let&apos;s build something reliable.</h2>
          <p className="contact-text">
            I&apos;m open to Java full stack, backend, and React roles. The fastest way to reach me is email.
          </p>

          <div className="contact-email">
            <a href={`mailto:${profile.email}`} className="email-link">
              <Icon name="mail" size={20} /> {profile.email}
            </a>
            <button type="button" className="btn btn-on-dark" onClick={copyEmail} aria-live="polite">
              <Icon name={copied ? 'check' : 'copy'} size={16} /> {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="contact-links">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <Icon name="linkedin" size={16} /> {profile.linkedinLabel}
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <Icon name="github" size={16} /> {profile.githubLabel}
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer">
              <Icon name="file" size={16} /> Resume (PDF)
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// The page renders after load, so the browser can't jump to a #section link on its own.
function useInitialHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const el = document.getElementById(id)
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }))
  }, [])
}

function App() {
  useReveal()
  useInitialHashScroll()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
      <Chatbot />
    </>
  )
}

export default App
