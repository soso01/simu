import React, { useContext } from "react"
import axios from 'axios'

import Head from "next/head"
import Card from '../components/Card'
import SearchBar from '../components/SearchBar'

const Home = ({games}) => {
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

export async function getStaticProps() {
  const {
    sortBy,
    dateSort,
    searchName,
  } = useContext(AppContext)

  const games = (await axios.post("/game/getList", {sortBy, dateSort, searchName})).data

  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      games,
    },
  }
}

export default Home
