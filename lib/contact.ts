export const contactStatuses = ['new', 'read', 'replied', 'archived'] as const
export type ContactStatus = (typeof contactStatuses)[number]

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  subject: string | null
  message: string
  status: ContactStatus
  admin_note: string | null
  created_at: string
  updated_at: string
  locale?: 'tr' | 'en'
}

export const contactStatusLabels: Record<ContactStatus, string> = {
  new: 'Yeni',
  read: 'Okundu',
  replied: 'Yanıtlandı',
  archived: 'Arşivlendi',
}

const limits = { name: 120, email: 254, phone: 40, company: 150, subject: 200, message: 5000 }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type ContactInput = {
  name: string
  email: string
  phone: string | null
  company: string | null
  subject: string | null
  message: string
}

export function validateContactPayload(value: unknown): ContactInput {
  if (!value || typeof value !== 'object') throw new Error('INVALID')
  const data = value as Record<string, unknown>
  const text = (key: keyof typeof limits) => typeof data[key] === 'string' ? data[key].trim() : ''
  const name = text('name')
  const email = text('email').toLowerCase()
  const message = text('message')
  const optional = (key: 'phone' | 'company' | 'subject') => text(key) || null
  const phone = optional('phone')?.replace(/[^\d+()\s.-]/g, '') || null
  const input = { name, email, phone, company: optional('company'), subject: optional('subject'), message }

  if (!name || !email || !message || !emailPattern.test(email)) throw new Error('INVALID')
  for (const [key, limit] of Object.entries(limits)) {
    const field = input[key as keyof ContactInput]
    if (field && field.length > limit) throw new Error('TOO_LONG')
  }
  return input
}
