import React, { useState, useContext, useEffect } from "react"
import axios from "axios"

import Head from "next/head"
import Card from "../components/Card"
import SearchBar from "../components/SearchBar"
import { AppContext } from "./_app"

const Home = () => {
  const { sortBy, dateSort, searchName } = useContext(AppContext)
  const [games, setGames] = useState([])
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const fetch = async () => {
      setPage(0)
      const res = await axios.post("/game/getList", {
        sortBy,
        dateSort,
        searchName,
        page,
      })
      setGames(res.data)

      const countRes = await axios.post("/game/getCount", {
        dateSort,
        searchName,
      })
      setCount(countRes.data.count)
    }
    fetch()
  }, [sortBy, dateSort, searchName])

  const moreGames = async () => {
    const scrollTop = window.pageYOffset
    const res = await axios.post("/game/getList", {
      sortBy,
      dateSort,
      searchName,
      page: page + 1,
    })
    setPage(page + 1)
    setGames([...games, ...res.data])
    window.scrollTo({top: scrollTop})
  }

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SearchBar />
        <div
          className="columns is-mobile is-multiline is-centered"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {games.map((v, i) => (
            <Card key={i} data={v} />
          ))}
          {(page + 1) * 10 < count && (
            <div style={{ width: "80%" }}>
              <button
                className="button mt-4 mb-4 is-primary is-rounded is-fullwidth"
                onClick={moreGames}
              >
                More
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
