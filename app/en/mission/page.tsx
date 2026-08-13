import type { Metadata } from 'next'
import { CorporateDetail } from '@/components/corporate-detail'
import { localizedAlternates } from '@/lib/seo'

export const metadata: Metadata = { title: 'Our Mission | Pars Medya', description: 'Discover Pars Medya’s mission to simplify business operations through custom software, automation and sustainable digital transformation.', alternates: localizedAlternates('/en/mission', '/misyonumuz', '/en/mission') }
const paragraphs = [
  'Our mission is to simplify complex digital operations and turn technology investment into measurable business outcomes. Every engagement begins with a clear understanding of goals, users and existing workflows so that the solution addresses real priorities instead of adding unnecessary complexity.',
  'We develop custom software for processes that standard products cannot support effectively. CRM, ERP, web applications, mobile products and system integrations are shaped around each organization’s rules, giving teams a reliable source of data and a consistent way to work.',
  'Automation helps organizations reduce repetitive tasks, control avoidable errors and give people more time for valuable work. Approval flows, notifications, task management, document generation and system-to-system data exchange are designed with the right oversight and accountability.',
  'Dashboards and reporting platforms turn fragmented operational data into useful indicators, enabling leaders to make evidence-based decisions. Alongside software delivery, our digital experience and visibility work helps brands communicate clearly and strengthen customer engagement.',
  'Security, performance and maintainability are considered from the beginning. Role-based access, validation, auditability and sustainable architecture are treated as core product requirements, not additions left until the end of development.',
  'Our responsibility continues after launch. We use feedback, product data and evolving business needs to improve each platform, building transparent and long-term partnerships around continuous value rather than one-time delivery.',
]
const principles = [
  { title: 'Business-Led Technology', description: 'Every technical choice is connected to a real user need and measurable business objective.' }, { title: 'Transparent Communication', description: 'Scope, progress, risks and decisions remain visible to the people responsible for the outcome.' }, { title: 'Security', description: 'Data protection, access control and secure engineering are built into the delivery process.' }, { title: 'Quality', description: 'Testing, review and clear standards protect software, experience and delivery quality.' }, { title: 'Flexibility', description: 'Modular systems adapt safely as priorities, teams and market conditions change.' }, { title: 'Continuous Improvement', description: 'Live products evolve through feedback, evidence and ongoing technical care.' },
]
const steps = ['Needs Analysis', 'Strategy & Planning', 'Design & User Experience', 'Software Development', 'Testing & Quality Assurance', 'Launch', 'Support & Continuous Improvement']
export default function EnglishMissionPage() { return <CorporateDetail locale="en" title="Our Mission" description="We create secure and sustainable digital solutions that simplify operations, empower teams and translate technology into measurable progress." paragraphs={paragraphs} principles={principles} steps={steps} ctaTitle="Let’s digitalize your business processes together." /> }
