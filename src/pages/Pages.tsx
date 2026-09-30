import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { actions, people, type Person } from '../data/demo'

function Heading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>
}
function Avatar({ initials }: { initials: string }) { return <span className="avatar">{initials}</span> }
function Pill({ status }: { status: string }) { return <span className={`pill ${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span> }
function PersonTable({ rows = people }: { rows?: Person[] }) {
  return <div className="table-scroll"><table><thead><tr><th>PERSON</th><th>UNIT</th><th>STATUS</th><th>CHANGE FROM BASELINE</th><th>LAST CHECK-IN</th></tr></thead><tbody>{rows.map((p) => <tr key={p.id}>
    <td><Link className="person" to={`/personnel/${p.id}`}><Avatar initials={p.initials} /><span><b>{p.name}</b><small>{p.role}</small></span></Link></td><td>{p.unit}</td><td><Pill status={p.risk} /></td><td className={p.change.startsWith('+') ? 'trend' : ''}>{p.change}</td><td>{p.last}</td>
  </tr>)}</tbody></table></div>
}
function TrendChart() {
  return <><svg className="chart" viewBox="0 0 350 150" role="img" aria-label="Synthetic personal risk pattern over seven days">{[20,70,120].map((y) => <line key={y} x1="8" x2="340" y1={y} y2={y} />)}<polyline points="10,100 62,86 115,92 168,70 222,76 275,48 338,38" />{[[10,100],[62,86],[115,92],[168,70],[222,76],[275,48],[338,38]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="3" />)}</svg><div className="chart-days"><span>Oct 8</span><span>Oct 9</span><span>Oct 10</span><span>Oct 11</span><span>Oct 12</span><span>Oct 13</span><span>Today</span></div></>
}
function Factor({ name, note, width, color = '' }: { name: string; note: string; width: string; color?: string }) {
  return <div className="factor"><div><b>{name}</b><small>{note}</small></div><div className="bar"><i className={color} style={{ width }} /></div></div>
}

export function OverviewPage() {
  return <div className="page">
    <Heading eyebrow="MONDAY, OCTOBER 14, 2024" title="Good morning, Maya" description="A thoughtful check-in can make a meaningful difference." action={<button className="button">This week ⌄</button>} />
    <section className="welcome"><div className="welcome-copy"><small>YOUR NORTH DISTRICT SNAPSHOT</small><h2>People are more than a number.</h2><p>Notice meaningful changes, understand the context, and make space for a human conversation.</p><Link to="/risk-intelligence">Explore risk intelligence →</Link></div><div className="welcome-number"><b>24</b><span>people in your care</span></div></section>
    <section className="metrics"><article className="metric card"><div className="metric-label">Need a check-in</div><strong>1 <small>of 24 people</small></strong><div className="metric-foot">Meaningful change from personal baseline</div></article><article className="metric card"><div className="metric-label">Worth keeping an eye on</div><strong>2 <small>people</small></strong><div className="metric-foot">Small shifts, early enough to notice</div></article><article className="metric card"><div className="metric-label">Open follow-ups</div><strong>3 <small>actions</small></strong><div className="metric-foot">One due today · Two planned</div></article></section>
    <section className="columns"><article className="card card-pad"><div className="card-head"><div><h2>Recent changes</h2><p>Compared with each person’s own baseline</p></div><Link className="text-link" to="/personnel">View all →</Link></div><PersonTable rows={people.slice(0,3)} /></article>
      <article className="card card-pad"><div className="card-head"><div><h2>Welfare pattern</h2><p>North District · last 7 days</p></div><span className="pill stable">Mostly steady</span></div><TrendChart /><div className="callout">One person has shifted noticeably from their usual pattern. <Link className="text-link" to="/risk-intelligence">Take a closer look</Link></div></article></section>
    <section className="columns"><article className="card card-pad"><div className="card-head"><div><h2>Follow-ups</h2><p>A little support, at the right time</p></div><Link className="text-link" to="/interventions">See all →</Link></div>{actions.slice(0,2).map((a) => <div className="intervention-row" key={a.person}><Avatar initials={a.initials} /><div><strong>{a.type}</strong><small>{a.person} · {a.owner}</small></div><small>{a.due}</small></div>)}</article>
      <article className="card note-card"><span className="note-icon">◇</span><div><h2>Care stays personal.</h2><p>Individual welfare details are separate from leadership’s aggregated view.</p><Link to="/privacy">Understand the Welfare Firewall →</Link></div></article></section>
  </div>
}

export function PersonnelPage() {
  const [query, setQuery] = useState('')
  const filteredPeople = people.filter((person) =>
    `${person.name} ${person.role} ${person.unit} ${person.risk}`.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return <div className="page"><Heading eyebrow="YOUR PEOPLE" title="Personnel" description="Notice changes in the context of each person’s own baseline." action={<button className="button primary">＋ Add person</button>} /><div className="toolbar"><label className="search-wrap"><span aria-hidden="true">⌕</span><input className="search" placeholder="Search by name, role, unit or status" aria-label="Search personnel" value={query} onChange={(event) => setQuery(event.target.value)} /></label><button className="button">All statuses ⌄</button><span className="result-count">{filteredPeople.length} shown</span></div><section className="card table-card">{filteredPeople.length > 0 ? <PersonTable rows={filteredPeople} /> : <div className="empty-state"><strong>No matching personnel</strong><span>Try another name, role, unit or status.</span></div>}</section><p className="disclaimer">Demo data for illustration. Patterns are compared with each person’s own baseline.</p></div>
}

export function PersonnelDetailPage() {
  const { id } = useParams()
  const person = people.find((entry) => entry.id === id) ?? people[0]
  const personActions = actions.filter((action) => action.person === person.name)
  const explanation = person.risk === 'Elevated'
    ? 'Several signals have moved together outside this person’s usual pattern.'
    : person.risk === 'Watch'
      ? 'A smaller change from this person’s usual pattern is worth a thoughtful follow-up.'
      : 'Recent patterns remain within this person’s established baseline.'

  return <div className="page profile-page">
    <Link to="/personnel" className="back">‹ All personnel</Link>
    <section className="profile-head">
      <Avatar initials={person.initials} />
      <div className="profile-identity"><div className="eyebrow">PERSONAL WELFARE PROFILE</div><h1>{person.name}</h1><p>{person.role} · {person.unit}</p></div>
      <div className="profile-updated"><small>LAST UPDATED</small><strong>{person.last}</strong></div>
      <Pill status={person.risk} />
    </section>
    <section className="profile-overview" aria-label="Welfare overview">
      <article className="card profile-overview-item"><small>Current status</small><Pill status={person.risk} /><span>Based on recent personal patterns</span></article>
      <article className="card profile-overview-item"><small>Change from baseline</small><strong className={person.change.startsWith('+') ? 'trend' : ''}>{person.change}</strong><span>Individual pattern comparison</span></article>
      <article className="card profile-overview-item"><small>Recent signals</small><strong>{person.factors.length}</strong><span>To consider in context</span></article>
    </section>
    <div className="profile-layout">
      <div className="stack">
        <article className="card card-pad profile-chart-card">
          <div className="card-head"><div><h2>Welfare trend</h2><p>Pattern over time, considered against a personal baseline</p></div><span className="profile-range">Last 7 days</span></div>
          <TrendChart />
          <div className="chart-caption"><span className="chart-key" /> Illustrative recent pattern <span className="baseline-caption">Compared with the personal baseline</span></div>
        </article>
        <article className="card card-pad signal-card">
          <div className="card-head"><div><h2>Recent signals</h2><p>Changes that may be useful to discuss, not conclusions</p></div></div>
          <div className="signal-list">{person.factors.map((factor, index) => <div className="signal-row" key={factor}>
            <span className={`signal-marker ${index === 0 && person.risk === 'Elevated' ? 'signal-marker-priority' : ''}`} />
            <div className="signal-detail"><strong>{factor}</strong><small>Change from personal baseline · {person.last}</small></div>
            <Pill status={person.risk} />
            <span className="signal-change">{index === 0 ? person.change : 'Contributing signal'}</span>
          </div>)}</div>
        </article>
      </div>
      <div className="stack">
        <article className="card card-pad explanation-card">
          <div className="card-head"><div><h2>Risk explanation</h2><p>Why this pattern is being surfaced</p></div><Pill status={person.risk} /></div>
          <p>{explanation}</p>
          <ul>{person.factors.map((factor) => <li key={factor}>{factor}</li>)}</ul>
          <div className="explanation-foot">Signals support human review; they are not a diagnosis.</div>
        </article>
        <article className="card card-pad history-card">
          <div className="card-head"><div><h2>Intervention history</h2><p>Welfare team follow-ups</p></div></div>
          {personActions.length ? <div className="history-list">{personActions.map((action) => <div className="history-entry" key={action.type}>
            <span className="history-dot" /><div><strong>{action.type}</strong><small>{action.owner} · {action.due}</small></div><Pill status={action.status} />
          </div>)}</div> : <div className="history-empty">No previous follow-ups recorded in this demo.</div>}
        </article>
        <article className="card profile-action-card">
          <span className="action-kicker">RECOMMENDED HUMAN ACTION</span>
          <h2>Make space for a conversation</h2>
          <p>Offer a private check-in and let {person.name.split(' ')[0]} share what support would be useful.</p>
          <button className="button primary">Schedule welfare check-in</button>
        </article>
      </div>
    </div>
  </div>
}

export function RiskIntelligencePage() {
  const stable = people.filter((person) => person.risk === 'Stable').length
  const watch = people.filter((person) => person.risk === 'Watch').length
  const elevated = people.filter((person) => person.risk === 'Elevated').length
  const priorityPeople = people.filter((person) => person.risk !== 'Stable')

  return <div className="page risk-page">
    <Heading eyebrow="NOTICE WHAT’S CHANGING" title="Risk intelligence" description="Understand meaningful changes against personal patterns—not one-size-fits-all thresholds." />
    <section className="intel-flow card" aria-label="Welfare intelligence workflow">
      {['Signals', 'Personal baseline', 'Meaningful deviation', 'Risk assessment', 'Human review', 'Welfare intervention'].map((stage, index) => <div className="intel-stage" key={stage}>
        <span>{String(index + 1).padStart(2, '0')}</span><strong>{stage}</strong>{index < 5 && <i aria-hidden="true">›</i>}
      </div>)}
    </section>
    <section className="risk-overview">
      <article className="card risk-stat"><small>People monitored</small><b>{people.length}</b><span>In this synthetic demo</span></article>
      <article className="card risk-stat"><small>Stable</small><b>{stable}</b><span>Within personal range</span></article>
      <article className="card risk-stat"><small>Watch</small><b>{watch}</b><span>Worth keeping in view</span></article>
      <article className="card risk-stat"><small>Elevated</small><b>{elevated}</b><span>Meaningful deviation</span></article>
      <article className="card risk-stat"><small>Active interventions</small><b>{actions.length}</b><span>Welfare team follow-ups</span></article>
    </section>
    <section className="risk-content-grid">
      <article className="card card-pad distribution-card">
        <div className="card-head"><div><h2>Risk distribution</h2><p>People grouped by change from their own baseline</p></div></div>
        <div className="distribution-total"><strong>{people.length}</strong><span>people monitored</span></div>
        <div className="distribution-row"><div><span className="distribution-dot stable-dot" />Stable <b>{stable}</b></div><div className="distribution-track"><i className="distribution-stable" style={{ width: `${stable / people.length * 100}%` }} /></div></div>
        <div className="distribution-row"><div><span className="distribution-dot watch-dot" />Watch <b>{watch}</b></div><div className="distribution-track"><i className="distribution-watch" style={{ width: `${watch / people.length * 100}%` }} /></div></div>
        <div className="distribution-row"><div><span className="distribution-dot elevated-dot" />Elevated <b>{elevated}</b></div><div className="distribution-track"><i className="distribution-elevated" style={{ width: `${elevated / people.length * 100}%` }} /></div></div>
        <div className="distribution-caption">Distribution reflects demo personnel only.</div>
      </article>
      <article className="card baseline-principle"><span className="principle-symbol">↗</span><div><div className="eyebrow">PERSONAL, NOT GENERIC</div><h2>Change is measured against the individual.</h2><p>Signals are surfaced when patterns move meaningfully from a person’s own baseline—not because they differ from someone else.</p></div></article>
    </section>
    <section className="card card-pad priority-section">
      <div className="card-head"><div><h2>Priority cases</h2><p>Start with the clearest deviations; review each person’s context privately.</p></div><span className="disclaimer">Updated from demo check-ins</span></div>
      {priorityPeople.map((person) => <article className="priority-case" key={person.id}>
        <div className="priority-person"><Link className="person" to={`/personnel/${person.id}`}><Avatar initials={person.initials} /><span><b>{person.name}</b><small>{person.role} · {person.unit}</small></span></Link><Pill status={person.risk} /></div>
        <div className="priority-signals"><span className="priority-label">SIGNALS / DEVIATION</span><ul>{person.factors.map((factor) => <li key={factor}>{factor}</li>)}</ul></div>
        <div className="priority-next"><span className="priority-label">LAST UPDATE</span><strong>{person.last}</strong><span className="priority-label next-label">SUGGESTED NEXT STEP</span><Link to={`/personnel/${person.id}`}>{person.risk === 'Elevated' ? 'Review and offer a private check-in' : 'Keep in view and check in as appropriate'} <span aria-hidden="true">→</span></Link></div>
      </article>)}
    </section>
    <section className="human-review"><span className="review-icon">✓</span><div><strong>Human review required</strong><p>Vigilia identifies meaningful deviations from an individual's baseline. It does not diagnose conditions or make autonomous welfare decisions.</p></div></section>
  </div>
}

export function InterventionsPage() {
  return <div className="page"><Heading eyebrow="HUMAN SUPPORT" title="Interventions" description="Keep thoughtful follow-ups visible, manageable, and led by people who know each other." action={<button className="button primary">＋ Plan a check-in</button>} /><div className="risk-cards"><article className="card risk-stat"><small>Open follow-ups</small><b>3</b></article><article className="card risk-stat"><small>Due today</small><b>1</b></article><article className="card risk-stat"><small>Planned next</small><b>2</b></article></div><section className="card card-pad"><div className="card-head"><div><h2>Support in progress</h2><p>Private follow-ups for your welfare team</p></div><button className="button">All follow-ups⌄</button></div>{actions.map((a) => <div className="intervention-row" key={a.person}><Avatar initials={a.initials} /><div><strong>{a.person}</strong><small>{a.type}</small></div><div><small>OWNER</small><strong>{a.owner}</strong></div><div><small>DUE</small><strong>{a.due}</strong></div><span className="pill">{a.status}</span></div>)}</section><div className="info"><b>Support works best when it feels like support.</b> Offer time, listen without assumptions, and agree together on what would help.</div></div>
}

export function PrivacyPage() {
  return <div className="page"><Heading eyebrow="TRUST BY DESIGN" title="Privacy & the Welfare Firewall" description="Personal welfare information belongs in a care conversation—not a leadership report." /><section className="privacy-hero"><div className="eyebrow">TWO CLEARLY SEPARATE VIEWS</div><h2>Individual care. Aggregated insight.</h2><p>The Welfare Firewall separates details used by welfare officers to support individuals from high-level patterns leaders use to improve unit conditions.</p></section><div className="firewall"><article className="card firewall-card"><div className="eyebrow">WELFARE OFFICER VIEW</div><h2>Personal & contextual</h2><p>Understand an individual’s change from their own baseline and offer timely, human support.</p><ul><li>Personal patterns and contributing factors</li><li>Context for a supportive conversation</li><li>Follow-ups and recovery over time</li></ul></article><div className="firewall-gap">◇<span>WELFARE FIREWALL</span></div><article className="card firewall-card"><div className="eyebrow">LEADERSHIP VIEW</div><h2>Aggregated & de-identified</h2><p>Unit-level patterns help leaders consider working conditions without exposing personal profiles.</p><ul><li>Group-level trends over time</li><li>Shared workload patterns</li><li>No individual profiles or case details</li></ul></article></div><div className="principles"><div><b>01 · Personal baseline</b><p>Compare people with their own history, not one another.</p></div><div><b>02 · Human judgment</b><p>Signals invite a conversation; they do not make a decision.</p></div><div><b>03 · Purposeful separation</b><p>Individual care and aggregated insight stay distinct.</p></div></div><p className="disclaimer">This prototype uses synthetic data only. No real personnel information is present.</p></div>
}

export function UnitOverviewPage() {
  return <div className="page"><Heading eyebrow="AGGREGATED LEADERSHIP VIEW" title="Unit overview" description="A de-identified view of shared welfare patterns to inform thoughtful unit-level planning." action={<button className="button">Last 30 days ⌄</button>} /><div className="aggregation"><b>◇ Welfare Firewall is active</b><span>Aggregated patterns only. Individual profiles and case details are not available here.</span><Link to="/privacy">About this view →</Link></div><div className="metrics"><article className="metric card"><div className="metric-label">People represented</div><strong>24</strong><div className="metric-foot">Across North District</div></article><article className="metric card"><div className="metric-label">Patterns within personal range</div><strong>88%</strong><div className="metric-foot">Consistent over the past month</div></article><article className="metric card"><div className="metric-label">Shared workload trend</div><strong className="trend">Slightly higher ↗</strong><div className="metric-foot">Compared with previous period</div></article></div><div className="unit-grid"><article className="card"><div className="card-head"><div><h2>Collective welfare patterns</h2><p>Aggregated change across the unit · last 7 days</p></div><Pill status="Stable" /></div><TrendChart /><p className="disclaimer">◇ Minimum group size applied to protect privacy</p></article><article className="card"><h2>Shared themes</h2><Factor name="Duty hours" note="More people reporting longer shifts" width="72%" /><Factor name="Rest opportunities" note="Fewer consistent rest windows" width="58%" color="amber" /><Factor name="Routine & recovery" note="Largely consistent across unit" width="34%" color="green" /></article></div><p className="disclaimer">All figures are synthetic demo data. Aggregates are illustrative and do not represent real individuals or a live unit.</p></div>
}
