import Link from 'next/link'
import type { ContentBlock, InlineNode } from '@/lib/blog-content'

function Inline({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        if (node.type === 'link') {
          return (
            <Link
              key={`${node.href}-${index}`}
              href={node.href}
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              {node.text}
            </Link>
          )
        }
        return <span key={`t-${index}`}>{node.text}</span>
      })}
    </>
  )
}

export function BlogContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="mx-auto mt-12 max-w-3xl space-y-6 md:mt-16">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          if (block.level === 3) {
            return (
              <h3 key={`${block.text}-${index}`} className="pt-2 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {block.text}
              </h3>
            )
          }
          return (
            <h2 key={`${block.text}-${index}`} className="pt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {block.text}
            </h2>
          )
        }

        if (block.type === 'list') {
          const Tag = block.ordered ? 'ol' : 'ul'
          return (
            <Tag
              key={`list-${index}`}
              className={block.ordered
                ? 'list-decimal space-y-2 pl-6 text-base leading-8 text-muted-foreground sm:text-lg'
                : 'list-disc space-y-2 pl-6 text-base leading-8 text-muted-foreground sm:text-lg'}
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}><Inline nodes={item} /></li>
              ))}
            </Tag>
          )
        }

        if (block.type === 'table') {
          return (
            <div key={`table-${index}`} className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[32rem] border-collapse text-left text-sm sm:text-base">
                <thead className="bg-secondary/60">
                  <tr>
                    {block.headers.map((header) => (
                      <th key={header} className="border-b border-border px-4 py-3 font-display font-semibold text-foreground">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="odd:bg-background even:bg-secondary/20">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border-b border-border px-4 py-3 text-muted-foreground">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        return (
          <p key={`p-${index}`} className="text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
            <Inline nodes={block.nodes} />
          </p>
        )
      })}
    </div>
  )
}
