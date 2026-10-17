import type { Metadata } from 'next'
import { EdiPage, ediMetadata } from '@/components/edi/edi-page'

export const metadata: Metadata = ediMetadata('tr')

export default function EdiEntegrasyonuPage() {
  return <EdiPage locale="tr" />
}
