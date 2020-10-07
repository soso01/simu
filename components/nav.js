import React, { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"

import { useCookies } from "react-cookie"

const nav = () => {
  const [isBurger, setIsBurger] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [cookies, setCookies, removeCookies] = useCookies(["token"])

  useEffect(() => {
    const jwtCheck = async () => {
      const res = await axios.post("/login/isLogin", { token: cookies.token })
      if (res.data === "success") setIsLogin(true)
      else {
        setIsLogin(false)
      }
    }
    const setAnonymous = async () => {
      const res = await axios.post("/login/getAnonymousToken")
      setCookies("token", res.data)
    }
    if (cookies.token) jwtCheck()
    else setAnonymous()
  }, [cookies.token])

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item">
            <Link href="/">
                <img src="/logo.png" style={{height: "100% !important"}} width="112"/>
            </Link>
          </a>

          <a
            role="button"
            className={"navbar-burger burger " + (isBurger ? "is-active" : "")}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            onClick={() => setIsBurger(!isBurger)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <Link href="create">
              <a className="navbar-item">시뮬레이션 만들기</a>
            </Link>
            {isLogin && (
              <Link href="mygame">
                <a className="navbar-item">내 시뮬레이션</a>
              </Link>
            )}
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              {isLogin ? (

                <div className="buttons">
                  <Link href="changePassword">
                    <a className="button is-light">비번변경</a>
                  </Link>
                  <a
                    className="button is-primary"
                    onClick={() => removeCookies("token")}
                  >
                    <strong>로그아웃</strong>
                  </a>
                </div>
              ) : (
                <div className="buttons">
                  <Link href="join">
                    <a className="button is-primary">
                      <strong>회원가입</strong>
                    </a>
                  </Link>
                  <Link href="login">
                    <a className="button is-light">로그인</a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div
        className={isBurger ? "burger" : "is-hidden"}
        style={{ marginTop: 10, marginBottom: 20 }}
      >
        {isLogin ? (
          <>
            <Link href="create">
              <p
                className="has-text-centered has-text-weight-semibold"
                onClick={() => {
                  setIsBurger(!isBurger)
                }}
              >
                시뮬 만들기
              </p>
            </Link>
            <Link href="changePassword">
              <p
                className="has-text-centered has-text-weight-semibold"
                onClick={() => {
                  setIsBurger(!isBurger)
                }}
              >
                비밀번호 변경
              </p>
            </Link>
            <p
              className="has-text-centered has-text-weight-semibold"
              onClick={() => removeCookies("token")}
            >
              로그아웃
            </p>
          </>
        ) : (
          <>
            <Link href="login">
              <p
                className="has-text-centered has-text-weight-semibold"
                onClick={() => {
                  setIsBurger(!isBurger)
                }}
              >
                로그인
              </p>
            </Link>
            <Link href="join">
              <p
                className="has-text-centered has-text-weight-semibold"
                onClick={() => {
                  setIsBurger(!isBurger)
                }}
              >
                회원가입
              </p>
            </Link>
          </>
        )}
      </div>
    </>
  )
}

export default nav
