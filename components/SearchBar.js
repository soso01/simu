import React, { useContext, useState, useEffect } from "react"
import { AppContext } from "../pages/_app"

const SearchBar = ({initDateSort}) => {
  const {
    sortBy,
    setSortBy,
    dateSort,
    setDateSort,
    searchName,
    setSearchName,
  } = useContext(AppContext)
  const [tmpName, setTmpName] = useState("")

  useEffect(() => {
    if(initDateSort) setDateSort(initDateSort)
    setSearchName("")
  },[])

  return (
    <div
      className="columns is-mobile is-multiline is-centered"
      style={{ marginTop: 10 }}
    >
      <div className="column is-narrow">
        <div className="buttons has-addons">
          {[
            { name: "popular", text: "인기순" },
            { name: "recent", text: "최신순" },
          ].map((v, i) => (
            <button
              className={"button" + (sortBy === v.name ? " is-info" : "")}
              onClick={() => setSortBy(v.name)}
              key={i}
            >
              {v.text}
            </button>
          ))}
        </div>
      </div>
      <div className="column is-narrow">
        <div className="buttons has-addons">
          {[
            { name: "all", text: "전체" },
            { name: "month", text: "월" },
            { name: "week", text: "주" },
            { name: "day", text: "일" },
          ].map((v, i) => (
            <button
              className={"button" + (dateSort === v.name ? " is-info" : "")}
              onClick={() => setDateSort(v.name)}
              key={i}
            >
              {v.text}
            </button>
          ))}
        </div>
      </div>
      <div className="column is-narrow">
        <div className="row">
          <input
            className="input"
            type="text"
            placeholder="검색어 입력"
            value={tmpName}
            onChange={(e) => setTmpName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") setSearchName(tmpName)
            }}
          />
          <button
            className="button is-primary"
            onClick={() => setSearchName(tmpName)}
          >
            검색
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
