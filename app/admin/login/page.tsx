import { Suspense } from 'react'
import AdminLoginForm from './login-form'

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Memuat Halaman Login...</p>
        </div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}
