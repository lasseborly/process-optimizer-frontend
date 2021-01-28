import Link from 'next/link'

export default function Layout ( {children}) {
  return (
    <div>
      <Link href="/">
        <a>Home</a>
      </Link>
      <br/>
      <Link href="/experiment/experiment">
        <a>Experiment</a>
      </Link>
      {children}
    </div>
  )
}