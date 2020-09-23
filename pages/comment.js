import React, { useState, useEffect } from "react"
import axios from "axios"
import { port } from "../key"
import { useCookies } from "react-cookie"
import Router from "next/router"
import moment from "moment"
import "moment/locale/ko"
moment.locale("kr")

const limitNum = 20

const comment = ({ game, initBest, initComments, count }) => {
  const [cookies, setCookies, removeCookies] = useCookies(["token"])
  const [inputText, setInputText] = useState("")
  const [userId, setUserId] = useState("")
  const [comments, setComments] = useState(initComments)
  const [best, setBest] = useState(initBest)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.post("/login/getUserId", { token: cookies.token })
      setUserId(res.data)
    }
    fetch()
  }, [cookies.token])

  const moreComment = async (limitNum) => {
    setPage(page + 1)
    const res = await axios.post("/comment/getMoreComments", {
      seq: game.seq,
      page,
      limitNum,
    })
    console.log(res.data)
    setComments([...comments, ...res.data])
  }

  const submitComment = async () => {
    const res = await axios.post("/comment/addComment", {
      seq: game.seq,
      token: cookies.token,
      text: inputText,
    })
    if (res.data === "exist") {
      alert("한 시뮬레이션에 하나의 댓글만 달 수 있습니다.")
    } else if (res.data === "fail") {
      alert("댓글 등록에 실패했습니다.")
    } else if (res.data === "success") {
      alert("댓글이 등록되었습니다.")
    }
    Router.reload(window.location.pathname)
  }

  const recommendComment = async (comment) => {
    const res = await axios.post("/comment/recommend", {
      token: cookies.token,
      commentId: comment._id,
    })
    alert(res.data.msg)
    if (res.data.result === "success") {
      comment.recommendCount += 1
      setComments([...comments])
      setBest([...best])
    }
  }

  const accuseComment = async (comment) => {
    const res = await axios.post("/comment/accuse", {
      token: cookies.token,
      commentId: comment._id,
    })
    alert(res.data.msg)
  }

  const deleteComment = async (comment) => {
    if (confirm("댓글을 삭제하겠습니까?")) {
      const res = await axios.post("/comment/delete", {
        token: cookies.token,
        commentId: comments._id,
      })
      alert(res.data.msg)
      Router.reload(window.location.pathname)
    }
  }

  return (
    <div>
      <section className="hero is-small is-primary">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">{game.title}</h1>
            <h2 className="subtitle">by {game.nickName}</h2>
          </div>
        </div>
      </section>

      <div className="columns is-mobile is-centered mt-6">
        <div className="column is-11-mobile is-8-tablet">
          <div className="box">
            <div className="container mt-3 mb-6">
              <div className="notification">{game.desc}</div>
            </div>
            <article className="media">
              <div className="media-content">
                <div className="field">
                  <p className="control">
                    <div style={{ margin: 10 }}>
                      <strong>댓글 ({count})</strong>
                    </div>
                    <textarea
                      className="textarea"
                      placeholder="Add a comment..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    ></textarea>
                  </p>
                </div>
                <nav className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <a className="button is-info" onClick={submitComment}>
                        등록
                      </a>
                    </div>
                  </div>
                </nav>
              </div>
            </article>

            {best.map((v, i) => (
              <article className="media" key={i}>
                <div className="media-content">
                  <div className="content">
                    <div>
                      <strong style={{ color: "red" }}>Best) </strong>
                      <strong>{v.userNickname}</strong>
                      <small> + {v.recommendCount}</small>
                      <div className="mt-1 mb-1">{v.text}</div>
                      <small>
                        <a onClick={() => recommendComment(v)}>추천</a> ·{" "}
                        <a onClick={() => accuseComment(v)}>신고</a>
                        {v.userId === userId && (
                          <>
                            {" · "}
                            <a onClick={() => deleteComment(v)}>삭제</a>
                          </>
                        )}
                        {"   @ "}
                        {moment(v.created).fromNow()}
                      </small>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {comments.map((v, i) => (
              <article className="media" key={i}>
                <div className="media-content">
                  <div className="content">
                    <div>
                      <strong
                        style={{ color: v.userId === userId ? "blue" : null }}
                      >
                        {v.userNickname}
                      </strong>
                      {v.recommendCount > 0 && <small> + {v.recommendCount}</small>}
                      <div className="mt-1 mb-1">{v.text}</div>
                      <small>
                        <a onClick={() => recommendComment(v)}>추천</a> ·{" "}
                        <a onClick={() => accuseComment(v)}>신고</a>
                        {v.userId === userId && (
                          <>
                            {" · "}
                            <a onClick={() => deleteComment(v)}>삭제</a>
                          </>
                        )}
                        {"   @ "}
                        {moment(v.created).fromNow()}
                      </small>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            {page * limitNum < count && (
              <button
                className="button mt-4 mb-4 is-primary is-rounded is-fullwidth"
                onClick={() => moreComment(limitNum)}
              >
                More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const comments = await axios.post(
    "http://localhost:" + port + "/comment/getComments",
    {
      seq: req.params.seq,
      page: 0,
      limitNum,
    }
  )

  return {
    props: {
      ...comments.data,
    }, // will be passed to the page component as props
  }
}

export default comment
