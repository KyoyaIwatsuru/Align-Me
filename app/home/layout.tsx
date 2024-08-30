import Header from '@/components/Header'

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main className='py-4'>
      <Header />
      {children}
    </main>
  )
}