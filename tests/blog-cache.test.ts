import test from 'node:test'
import assert from 'node:assert/strict'
import {
  BLOG_CACHE_ROOT_TAG,
  BLOG_REVALIDATE_SECONDS,
  blogPostCacheTag,
  blogPostsCacheTag,
} from '../lib/blog-cache'

test('blog cache tags are stable and locale-aware', () => {
  assert.equal(BLOG_CACHE_ROOT_TAG, 'blog-posts')
  assert.equal(blogPostsCacheTag('tr'), 'blog-posts-tr')
  assert.equal(blogPostsCacheTag('en'), 'blog-posts-en')
  assert.equal(blogPostCacheTag('tr', 'crm-yazilimi-nedir'), 'blog-post-tr-crm-yazilimi-nedir')
})

test('blog cache revalidate window is one minute', () => {
  assert.equal(BLOG_REVALIDATE_SECONDS, 60)
})
