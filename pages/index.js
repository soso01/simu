import React, { useState, useContext, useEffect } from "react"
import axios from "axios"

import Head from "next/head"
import Card from "../components/Card"
import SearchBar from "../components/SearchBar"
import { AppContext } from "./_app"

const Home = () => {
  const { sortBy, dateSort, searchName } = useContext(AppContext)
  const [games, setGames] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.post("/game/getList", {
        sortBy,
        dateSort,
        searchName,
      })
      setGames(res.data)
    }

    fetch()
  }, [sortBy, dateSort, searchName])

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SearchBar />
        <div className="columns is-mobile is-multiline is-centered">
          {games.map((v, i) => (
            <Card key={i} data={v} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
