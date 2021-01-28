import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Layout from '../components/layout'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Brownie Bee</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
     <Layout>
        <h1>Welcome!</h1>
     </Layout>
    </div>
  )
}
