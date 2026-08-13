'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, FileText, Languages, LayoutDashboard, LogOut, Menu, MessageSquare, PlusCircle, X } from 'lucide-react'
import { logout } from '@/app/admin/actions'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'İstatistikler', icon: BarChart3 },
  { href: '/admin/contact', label: 'İletişim Talepleri', icon: MessageSquare },
  { href: '/admin/blog', label: 'Türkçe Yazılar', icon: FileText, blog: true },
  { href: '/admin/blog/en', label: 'İngilizce Yazılar', icon: Languages, blog: true },
  { href: '/admin/blog/new', label: 'Yeni Yazı', icon: PlusCircle, blog: true },
]

export function AdminShell({ children, newContactCount = 0 }: { children: React.ReactNode; newContactCount?: number }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const sidebar = <><div className="border-b border-primary-foreground/15 p-6"><p className="font-display text-xl font-bold">Pars<span className="text-accent">Medya</span></p><p className="mt-1 text-xs text-primary-foreground/65">Yönetim Paneli</p></div><nav className="flex-1 space-y-1 p-4">{links.map(({ href, label, icon: Icon, blog }, index) => <div key={href}>{blog && !links[index - 1]?.blog && <p className="mb-2 mt-5 px-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground/50">Blog</p>}<Link href={href} onClick={() => setOpen(false)} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors', blog && 'pl-5', pathname === href || (href.includes('/edit') && pathname.startsWith(`${href}/`)) ? 'bg-primary-foreground/15 text-primary-foreground' : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground')}><Icon className="h-4 w-4" /><span>{label}</span>{href === '/admin/contact' && newContactCount > 0 && <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">{newContactCount > 99 ? '99+' : newContactCount}</span>}</Link></div>)}</nav><form action={logout} className="border-t border-primary-foreground/15 p-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"><LogOut className="h-4 w-4" />Çıkış</button></form></>
  return <div className="min-h-screen bg-secondary/40"><aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-primary text-primary-foreground md:flex">{sidebar}</aside><header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:hidden"><span className="font-display font-bold">ParsMedya Admin</span><button onClick={() => setOpen(!open)} aria-label="Menüyü aç" className="p-2">{open ? <X /> : <Menu />}</button></header>{open && <aside className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-primary text-primary-foreground md:hidden">{sidebar}</aside>}<main className="min-w-0 p-4 sm:p-6 md:ml-64 lg:p-8">{children}</main></div>
}
