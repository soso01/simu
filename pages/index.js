import React, { useContext } from "react"
import Head from "next/head"
import Card from '../components/Card'
import SearchBar from '../components/SearchBar'

const Home = () => {

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SearchBar />
        <div className="columns is-mobile is-multiline is-centered">
          <Card/><Card/><Card/><Card/><Card/><Card/><Card/><Card/><Card/><Card/><Card/><Card/><Card/><Card/><Card/><Card/>
        </div>
      </main>
    </div>
  )
}

export default Home
