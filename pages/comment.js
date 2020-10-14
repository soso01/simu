import React, { useState, useEffect } from "react"
import axios from "axios"
import { port } from "../key"
import { useCookies } from "react-cookie"
import Head from "next/head"
import Router from "next/router"
import moment from "moment"
import "moment/locale/ko"
moment.locale("kr")

const limitNum = 2

const comment = ({ game, initBest, initComments, count }) => {
  const [cookies, setCookies, removeCookies] = useCookies(["token"])
  const [inputText, setInputText] = useState("")
  const [userId, setUserId] = useState("")
  const [comments, setComments] = useState(initComments)
  const [best, setBest] = useState(initBest)
  const [page, setPage] = useState(1)
  const [canMore, setCanMore] = useState(page * limitNum < count)

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
      if (page * limitNum < count) {
        moreComment(limitNum)
      }
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", _infiniteScroll, true)
    return () => window.removeEventListener("scroll", _infiniteScroll, true)
  }, [_infiniteScroll])

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.post("/login/getUserId", { token: cookies.token })
      setUserId(res.data)
    }
    fetch()
  }, [cookies.token])

  const moreComment = async (limitNum) => {
    const scrollTop = window.pageYOffset
    setPage(page + 1)
    const res = await axios.post("/comment/getMoreComments", {
      seq: game.seq,
      page,
      limitNum,
    })
    setComments([...comments, ...res.data])
    window.scrollTo({ top: scrollTop })
  }

  useEffect(() => {
    if (page * limitNum > count) {
      setCanMore(false)
    }
  }, [page])

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
        _id: comment._id,
      })
      alert(res.data.msg)
      Router.reload(window.location.pathname)
    }
  }

  const recommendGame = async () => {
    const res = await axios.post("/game/recommend", {
      token: cookies.token,
      seq: game.seq,
    })
    alert(res.data.msg)
    if (res.data.result === "success") {
      Router.reload(window.location.pathname)
    }
  }

  const accuseGame = async () => {
    const res = await axios.post("/game/accuse", {
      token: cookies.token,
      seq: game.seq,
    })
    alert(res.data.msg)
  }

  if (!game) {
    return <div>Not found</div>
  }

  return (
    <div>
      <Head>
        <title>{game.title} - 시뮬레이션 댓글페이지 시무</title>
        <meta
          name="description"
          content={
            game.desc.length > 200 ? game.desc.slice(0, 200) + "..." : game.desc
          }
        ></meta>
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:type" content="article"></meta>
        <meta
          property="og:url"
          content={"https://simu.kr/comment/" + game.seq}
        ></meta>
        <meta
          property="og:title"
          content={game.title + "- 시뮬레이션 댓글페이지 시무"}
        ></meta>
        <meta
          property="og:description"
          content={
            game.desc.length > 200 ? game.desc.slice(0, 200) + "..." : game.desc
          }
        ></meta>

        <meta name="twitter:card" content="summary"></meta>
        <meta
          name="twitter:title"
          content={game.title + "- 시뮬레이션 댓글페이지 시무"}
        ></meta>
        <meta
          name="twitter:description"
          content={
            game.desc.length > 200 ? game.desc.slice(0, 200) + "..." : game.desc
          }
        ></meta>
        <meta
          name="twitter:domain"
          content={"https://simu.kr/comment/" + game.seq}
        ></meta>
      </Head>
      <main>
        <div>
          <section className="hero is-small is-primary">
            <div className="hero-body">
              <div className="container">
                <h1 className="title">{game.title}</h1>
                <h2 className="subtitle">by {game.nickName}</h2>
              </div>
            </div>
          </section>

          <div className="columns is-mobile is-centered mt-2 mb-6">
            <div className="column is-11-mobile is-8-tablet">
              <div className="box">
                <div className="level is-mobile pt-3 pb-3">
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">추천수</p>
                      <p className="title">{game.recommendCount}</p>
                    </div>
                  </div>
                  {/* <div className="level-item has-text-centered">
                <div>
                  <p className="heading">조회수</p>
                  <p className="title">{game.count} </p>
                </div>
              </div> */}
                  <div className="level-item has-text-centered">
                    <div>
                      <p className="heading">댓글수</p>
                      <p className="title">{count}</p>
                    </div>
                  </div>
                </div>
                <div className="container pt-3 pb-3">
                  <div className="notification">
                    {game.desc.split("\n").map((v, i) => (
                      <span key={i}>
                        {v} <br />
                      </span>
                    ))}
                  </div>
                </div>

                <p className="is-size-5 has-text-weight-semibold has-text-centered pt-3 pb-3">
                  이 시뮬레이션을{" "}
                </p>
                <div
                  className="field is-grouped"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <p className="control">
                    <button className="button is-link" onClick={recommendGame}>
                      추천하기
                    </button>
                  </p>
                  <p className="control">
                    <button className="button" onClick={accuseGame}>
                      신고하기
                    </button>
                  </p>
                </div>

                <hr />

                <article className="media">
                  <div className="media-content">
                    <div className="field">
                      <div className="control">
                        <div style={{ margin: 10 }}>
                          <strong>댓글 ({count})</strong>
                        </div>
                        <textarea
                          className="textarea"
                          placeholder="Add a comment..."
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    <div className="row">
                      <a className="button is-info" onClick={submitComment}>
                        등록
                      </a>
                    </div>
                  </div>
                </article>
                {best.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "aliceblue",
                      paddingTop: 20,
                      paddingBottom: 20,
                      paddingLeft: 5,
                      paddingRight: 5,
                      marginTop: 10,
                      marginBottom: 10,
                      borderRadius: 10,
                    }}
                  >
                    {best.map((v, i) => (
                      <article className="media" key={i}>
                        <div className="media-content">
                          <div className="content">
                            <div>
                              <strong style={{ color: "blue" }}>Best) </strong>
                              <strong>{v.userNickname}</strong>
                              <small> + {v.recommendCount}</small>
                              <div className="mt-1 mb-1">{v.text}</div>
                              <small>
                                <a onClick={() => recommendComment(v)}>추천</a>{" "}
                                · <a onClick={() => accuseComment(v)}>신고</a>
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
                  </div>
                )}
                {comments.map((v, i) => (
                  <article className="media" key={i}>
                    <div className="media-content">
                      <div className="content">
                        <div>
                          <strong
                            style={{
                              color: v.userId === userId ? "darkmagenta" : null,
                            }}
                          >
                            {v.userNickname}
                          </strong>
                          {v.recommendCount > 0 && (
                            <small> + {v.recommendCount}</small>
                          )}
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

                {canMore && (
                  <button
                    className="button is-fullwidth is-info is-light mt-5 mb-5"
                    onClick={() => moreComment(limitNum)}
                  >
                    더 보기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
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
