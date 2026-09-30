import { useState, type Dispatch, type SetStateAction } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { actions, people, type Intervention, type InterventionEvent } from './data/demo'
import {
  InterventionsPage,
  OverviewPage,
  PersonnelDetailPage,
  PersonnelPage,
  PrivacyPage,
  RiskIntelligencePage,
  UnitOverviewPage,
} from './pages/Pages'
import './App.css'

export type InterventionWorkflow = {
  interventions: Intervention[]
  setInterventions: Dispatch<SetStateAction<Intervention[]>>
  events: InterventionEvent[]
  setEvents: Dispatch<SetStateAction<InterventionEvent[]>>
  createForId: string | null
  setCreateForId: Dispatch<SetStateAction<string | null>>
}

export default function App() {
  const [interventions, setInterventions] = useState<Intervention[]>(() => actions.map((action, index) => {
    const person = people.find((entry) => entry.name === action.person) ?? people[0]
    return {
      id: `demo-${index + 1}`,
      personId: person.id,
      person: person.name,
      initials: person.initials,
      role: person.role,
      unit: person.unit,
      reason: person.factors.join(' · '),
      riskAtCreation: person.risk,
      type: action.type,
      owner: action.owner,
      priority: person.risk === 'Elevated' ? 'High' : person.risk === 'Watch' ? 'Medium' : 'Low',
      status: action.status === 'In progress' ? 'In progress' : 'Pending',
      created: 'Oct 14, 2024',
      due: action.due,
      notes: '',
      assignedAt: 'Oct 14, 2024',
    }
  }))
  const [events, setEvents] = useState<InterventionEvent[]>([
    { id: 'event-risk-arjun', label: 'Elevated risk reviewed', person: 'Arjun Mehta', at: 'Today', interventionId: 'demo-1' },
    ...actions.flatMap((action, index) => [
      { id: `event-created-${index}`, label: `${action.type} created`, person: action.person, at: 'Oct 14, 2024', interventionId: `demo-${index + 1}` },
      { id: `event-assigned-${index}`, label: `Assigned to ${action.owner}`, person: action.person, at: 'Oct 14, 2024', interventionId: `demo-${index + 1}` },
      ...(action.status === 'In progress' ? [{ id: `event-started-${index}`, label: 'Intervention started', person: action.person, at: 'Today', interventionId: `demo-${index + 1}` }] : []),
    ]),
  ])
  const [createForId, setCreateForId] = useState<string | null>(null)
  const workflow: InterventionWorkflow = { interventions, setInterventions, events, setEvents, createForId, setCreateForId }

  return (
    <Routes>
      <Route element={<AppLayout workflow={workflow} />}>
        <Route index element={<OverviewPage />} />
        <Route path="officer" element={<OverviewPage />} />
        <Route path="personnel" element={<PersonnelPage />} />
        <Route path="personnel/:id" element={<PersonnelDetailPage />} />
        <Route path="risk-intelligence" element={<RiskIntelligencePage />} />
        <Route path="interventions" element={<InterventionsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="unit-overview" element={<UnitOverviewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
