import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AdminLayoutShell } from '@/components/admin/admin-layout-shell'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <AdminLayoutShell session={session}>
      {children}
    </AdminLayoutShell>
  )
}
