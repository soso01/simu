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

  const _infiniteScroll = () => {
    let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    let clientHeight = document.documentElement.clientHeight;
  
    if(scrollTop + clientHeight === scrollHeight) {
      if((page + 1) * 10 < count) moreGames()
    }
  }
  
  useEffect(() => {
    window.addEventListener('scroll', _infiniteScroll, true);
    return () => window.removeEventListener('scroll', _infiniteScroll, true);
  }, [_infiniteScroll]);
  
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
        </div>
      </main>
    </div>
  )
}

export default Home
