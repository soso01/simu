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
  const [canMore, setCanMore] = useState(false)

  const _infiniteScroll = () => {
    let scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    )
    let scrollTop = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    )
    let clientHeight = document.documentElement.clientHeight

    if (scrollTop + clientHeight === scrollHeight) {
      if ((page + 1) * 10 < count) moreGames()
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", _infiniteScroll, true)
    return () => window.removeEventListener("scroll", _infiniteScroll, true)
  }, [_infiniteScroll])

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
      if ((page + 1) * 10 < countRes.data.count) setCanMore(true)
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
    window.scrollTo({ top: scrollTop })
  }

  useEffect(() => {
    if ((page + 1) * 10 >= count) setCanMore(false)
  }, [page])

  return (
    <div>
      <Head>
        <title>SIMU - 시뮬레이션 커뮤니티 시무</title>
        <meta
          name="description"
          content="만화 아이돌 애니 드라마 미연시 빙의글 등 각종 장르의 팬픽 시뮬레이션 게임을 제공하는 사이트입니다."
        ></meta>
        <meta
          name="keyword"
          content="만화, 애니, 아이돌, 팬픽, 시뮬레이션, 웹게임, 미연시, 빙의글"
        ></meta>

        <meta property="og:locale" content="ko_KR" />
        <meta property="og:type" content="website"></meta>
        <meta property="og:url" content="https://simu.kr/"></meta>
        <meta
          property="og:title"
          content="SIMU - 시뮬레이션 커뮤니티 시무"
        ></meta>
        <meta
          property="og:description"
          content="만화 아이돌 애니 드라마 미연시 등 각종 장르의 팬픽 시뮬레이션 게임을 제공하는 사이트입니다."
        ></meta>

        <meta name="twitter:card" content="summary"></meta>
        <meta
          name="twitter:title"
          content="SIMU - 시뮬레이션 커뮤니티 시무"
        ></meta>
        <meta
          name="twitter:description"
          content="만화 아이돌 애니 드라마 미연시 등 각종 장르의 팬픽 시뮬레이션 게임을 제공하는 사이트입니다."
        ></meta>
        <meta name="twitter:domain" content="https://simu.kr/"></meta>
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
          {canMore && <button className="button is-fullwidth is-info is-light mb-5" onClick={moreGames}>
            더 보기
          </button>}
        </div>
      </main>
    </div>
  )
}

export default Home
