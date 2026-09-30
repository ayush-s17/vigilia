export type Person = {
  id: string
  name: string
  initials: string
  role: string
  unit: string
  risk: 'Elevated' | 'Watch' | 'Stable'
  change: string
  last: string
  factors: string[]
}

export type InterventionStatus = 'Pending' | 'In progress' | 'Completed'
export type InterventionPriority = 'Low' | 'Medium' | 'High'
export type InterventionEvent = {
  id: string
  label: string
  person: string
  at: string
  interventionId?: string
}

export type Intervention = {
  id: string
  personId: string
  person: string
  initials: string
  role: string
  unit: string
  reason: string
  riskAtCreation: Person['risk']
  type: string
  owner: string
  priority: InterventionPriority
  status: InterventionStatus
  created: string
  due: string
  notes: string
  assignedAt: string
  startedAt?: string
  completedAt?: string
}

export const people: Person[] = [
  { id: 'arjun-mehta', name: 'Arjun Mehta', initials: 'AM', role: 'Operations specialist', unit: 'North District', risk: 'Elevated', change: '+24 points', last: 'Today, 9:42 am', factors: ['Sleep below personal baseline', 'Increased duty hours', 'Check-in pattern changed'] },
  { id: 'priya-nair', name: 'Priya Nair', initials: 'PN', role: 'Field coordinator', unit: 'North District', risk: 'Watch', change: '+11 points', last: 'Today, 8:15 am', factors: ['Rest days reduced', 'Workload trending upward'] },
  { id: 'kabir-shah', name: 'Kabir Shah', initials: 'KS', role: 'Logistics officer', unit: 'Central District', risk: 'Watch', change: '+8 points', last: 'Yesterday, 4:28 pm', factors: ['Sleep variability increased'] },
  { id: 'sana-khan', name: 'Sana Khan', initials: 'SK', role: 'Community liaison', unit: 'South District', risk: 'Stable', change: '—', last: 'Yesterday, 2:06 pm', factors: ['Patterns within personal baseline'] },
  { id: 'dev-patel', name: 'Dev Patel', initials: 'DP', role: 'Operations specialist', unit: 'Central District', risk: 'Stable', change: '—', last: 'Monday, 3:51 pm', factors: ['Patterns within personal baseline'] },
]

export const actions = [
  { person: 'Arjun Mehta', initials: 'AM', type: 'Welfare check-in', owner: 'Maya Desai', due: 'Today', status: 'Needs attention' },
  { person: 'Priya Nair', initials: 'PN', type: 'Schedule review', owner: 'Rohan Iyer', due: 'Tomorrow', status: 'In progress' },
  { person: 'Kabir Shah', initials: 'KS', type: 'Peer support offer', owner: 'Maya Desai', due: 'Fri, 18 Oct', status: 'Planned' },
]
