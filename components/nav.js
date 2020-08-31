import React, { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"

import { useCookies } from "react-cookie"

const nav = () => {
  const [isBurger, setIsBurger] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [cookies, setCookies, removeCookies] = useCookies(["token"])
  console.log("쿠키 : ", cookies.token)

  useEffect(() => {
    const jwtCheck = async () => {
      const res = await axios.post("/login/jwtVerify", { token: cookies.token })
      console.log("res.data : ", res.data)
      if (res.data === "success") setIsLogin(true)
      else {
        setIsLogin(false)
        removeCookies("token")
      }
    }
    if (cookies.token) jwtCheck()
    else setIsLogin(false)
  }, [cookies.token])

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item">
            <Link href="/">
              <img
                src="https://bulma.io/images/bulma-logo.png"
                width="112"
                height="28"
              />
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
              <a className="navbar-item">만들기</a>
            </Link>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              {isLogin ? (
                <div className="buttons">
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
        <Link href="create">
          <p
            className="has-text-centered has-text-weight-semibold"
            onClick={() => {
              setIsBurger(!isBurger)
            }}
          >
            만들기
          </p>
        </Link>
      </div>
    </>
  )
}

export default nav
