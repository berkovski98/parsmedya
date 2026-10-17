import type { Metadata } from 'next'
import { EdiPage, ediMetadata } from '@/components/edi/edi-page'

export const metadata: Metadata = ediMetadata('en')

export default function EdiIntegrationPage() {
  return <EdiPage locale="en" />
}
