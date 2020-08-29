import "bulma"
import "../public/scss/global.scss"
import React, { useState, createContext } from "react"
import Nav from '../components/Nav'

export const AppContext = createContext()

export default function MyApp({ Component, pageProps }) {
  const [sortBy, setSortBy] = useState("recent")
  const [dateSort, setDateSort] = useState("all")
  const [searchName, setSearchName] = useState("")
  const initData = {
    sortBy,
    setSortBy,
    dateSort,
    setDateSort,
    searchName,
    setSearchName,
  }
  return (
    <AppContext.Provider value={initData}>
      <Nav/>
      <Component {...pageProps} />
    </AppContext.Provider>
  )
}
