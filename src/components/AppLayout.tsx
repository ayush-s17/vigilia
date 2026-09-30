import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import type { InterventionWorkflow } from '../App'

const links = [
  { label: 'Overview', to: '/', symbol: '▦' },
  { label: 'Personnel', to: '/personnel', symbol: '♙' },
  { label: 'Risk intelligence', to: '/risk-intelligence', symbol: '⌁' },
  { label: 'Interventions', to: '/interventions', symbol: '♡' },
]
const orgLinks = [
  { label: 'Unit overview', to: '/unit-overview', symbol: '⌂' },
  { label: 'Privacy', to: '/privacy', symbol: '◇' },
]
function titleFor(path: string) {
  if (path.startsWith('/personnel/')) return 'Personnel profile'
  return [...links, ...orgLinks].find((link) => link.to === path)?.label ?? 'Overview'
}

export function AppLayout({ workflow: _workflow }: { workflow: InterventionWorkflow })  {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const linkGroup = (items: typeof links) => items.map((link) => (
    <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
      <span className="nav-symbol" aria-hidden="true">{link.symbol}</span>{link.label}
      {link.label === 'Interventions' && <span className="nav-count">3</span>}
    </NavLink>
  ))

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <NavLink className="brand" to="/" onClick={() => setOpen(false)}><img className="brand-logo" src="/vigilia-logo.png.jpeg" alt="Vigilia" /><span><strong>VIGILIA</strong><small>Personnel Welfare Intelligence</small></span></NavLink>
        <div className="nav-title">WORKSPACE</div><nav className="nav-list" aria-label="Main navigation">{linkGroup(links)}</nav>
        <div className="nav-title">ORGANISATION</div><nav className="nav-list" aria-label="Organisation navigation">{linkGroup(orgLinks)}</nav>
        <div className="sidebar-space" />
        <div className="welfare-note"><b>Welfare comes first</b><p>Individual information stays with those who provide care.</p><NavLink to="/privacy">How privacy works →</NavLink></div>
        <div className="officer"><span className="avatar">MD</span><div><b>Maya Desai</b><small>Welfare officer</small></div></div>
      </aside>
      {open && <button className="scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <div className="main-column">
        <header className="topbar"><button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setOpen(!open)}><i /><i /><i /></button><div className="crumb">VIGILIA / {titleFor(location.pathname)}</div><div className="top-actions"><span className="district">North District</span><span aria-label="Notifications">♧</span><span className="avatar">MD</span></div></header>
        <main className="main-content"><Outlet /></main>
        <footer className="footer"><span>VIGILIA · Personnel Welfare Intelligence</span><span>Demo workspace · Synthetic data</span></footer>
      </div>
    </div>
  )
}
