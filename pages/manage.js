import React, { useState, useEffect } from "react"
import { useCookies } from "react-cookie"
import axios from "axios"
import AccuseCard from "../components/AccuseCard"
import moment from "moment"
import "moment/locale/ko"
moment.locale("kr")

const manage = () => {
  const [cookies, setCookie] = useCookies(["token"])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [commentList, setCommentList] = useState([])
  const [gameList, setGameList] = useState([])

  const clearAccuseComment = async (v) => {
    const res = await axios.post("/comment/clearAccuseComment", {
      _id: v._id,
      token: cookies.token,
    })
    setCommentList(commentList.filter((comment) => v != comment))
  }

  const deleteAccuseComment = async (v) => {
    const res = await axios.post("/comment/delete", {
      _id: v._id,
      token: cookies.token,
    })
    setCommentList(commentList.filter((comment) => v != comment))
  }

  const clearAccuseGame = async (v) => {
    const res = await axios.post("/game/clearAccuseGame", {
      _id: v._id,
      token: cookies.token,
    })
    setGameList(gameList.filter((game) => v != game))
  }

  const deleteAccuseGame = async (v) => {
    const res = await axios.post("/game/delete", {
      seq: v.seq,
      token: cookies.token,
    })
    setGameList(gameList.filter((game) => v != game))
  }

  useEffect(() => {
    const checkAdmin = async () => {
      const res = await axios.post("/login/isAdmin", { token: cookies.token })
      setIsAdmin(res.data)
      setIsLoading(true)
      if (res.data) {
        const getComments = await axios.post("/comment/getAccusedComments", {
          token: cookies.token,
        })
        setCommentList(getComments.data)
        const getGames = await axios.post("/game/getAccusedGames", {
          token: cookies.token,
        })
        setGameList(getGames.data)
      }
    }
    checkAdmin()
  }, [])

  if (!isLoading) return <div>Loading...</div>
  if (!isAdmin) return <div>관리자만 접근할 수 있습니다.</div>
  return (
    <div>
      <div>
        <div className="is-size-4 has-text-weight-bold has-text-centered">
          신고 게시글 ({gameList.length})
        </div>
        <div
          className="columns is-mobile is-multiline is-centered"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {gameList.map((v, i) => (
            <AccuseCard
              key={i}
              data={v}
              clearAccuseGame={() => clearAccuseGame(v)}
              deleteAccuseGame={() => deleteAccuseGame(v)}
            />
          ))}
        </div>
      </div>
      <div>
        <div className="is-size-4 has-text-weight-bold has-text-centered mt-5">
          신고 댓글 ({commentList.length})
        </div>
        <div className="columns is-mobile is-centered mt-2 mb-6">
          <div className="column is-11-mobile is-8-tablet">
            <div className="box">
              {commentList.map((v, i) => (
                <article className="media" key={i}>
                  <div className="media-content">
                    <div className="content">
                      <div>
                        <strong>{v.userNickname}</strong>
                        {v.recommendCount > 0 && (
                          <small> + {v.recommendCount}</small>
                        )}
                        <div className="mt-1 mb-1">{v.text}</div>
                        <small>
                          <a onClick={() => clearAccuseComment(v)}>
                            신고초기화
                          </a>{" "}
                          · <a onClick={() => deleteAccuseComment(v)}>삭제</a>
                          {"   @ "}
                          {moment(v.created).fromNow()}
                        </small>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default manage
