import React, {useState, useEffect, useContext} from "react"
import { useCookies } from "react-cookie"
import axios from 'axios'
import router from 'next/router'
import Head from "next/head"

import { AppContext } from "./_app"
import SearchBar from '../components/SearchBar'
import MyCard from '../components/myCard'

const mygame = () => {
  const { sortBy, dateSort, searchName } = useContext(AppContext)
  const [cookies, setCookies, removeCookies] = useCookies(["token"])
  const [games, setGames] = useState([])
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)

  const getCount = async () => {
    const res = await axios.post("/game/getUserCount", {dateSort, searchName, token: cookies.token})
    setCount(res.data.count)
  }

  const fetch = async () => {
    const res = await axios.post("/game/getMyList", {token: cookies.token, page: 0, sortBy, dateSort, searchName})
    if(res.data === "fail") return router.push('/login')
    setPage(1)
    setGames(res.data)
  }

  const moreGames = async () => {
    const res = await axios.post("/game/getMyList", {token: cookies.token, page, sortBy, dateSort, searchName})
    console.log("more")
    if(res.data === "fail") return router.push('/login')
    setPage(page + 1)
    setGames([...games, ...res.data])
  }

  const _infiniteScroll = () => {
    let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    let clientHeight = document.documentElement.clientHeight;
  
    if(scrollTop + clientHeight === scrollHeight) {
      if(page * 10 < count) {
        moreGames()
      }
    }
  }
  
  useEffect(() => {
    window.addEventListener('scroll', _infiniteScroll, true);
    return () => window.removeEventListener('scroll', _infiniteScroll, true);
  }, [_infiniteScroll]);

  useEffect(() => {
    fetch()
    getCount()
  }, [sortBy, searchName, dateSort])

  return <div>
  <Head>
    <title>MyGames</title>
    <link rel="icon" href="/favicon.ico" />
  </Head>
  <main>
    <SearchBar initDateSort="all"/>
    <div
      className="columns is-mobile is-multiline is-centered"
      style={{ display: "flex", flexWrap: "wrap" }}
    >
      {games.map((v, i) => (
        <MyCard key={i} data={v} />
      ))}
    </div>
  </main>
</div>
}

export default mygame
