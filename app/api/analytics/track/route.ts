import { recordAnalyticsPost } from '@/lib/analytics-post'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return recordAnalyticsPost(request)
}
