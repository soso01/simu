import React, { useState } from "react"
import Link from "next/link"
import axios from "axios"
import Head from "next/head"
import { useCookies } from "react-cookie"

const login = () => {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [longExp, setLongExp] = useState(false)
  const [cookies, setCookie] = useCookies(["token"])

  const submit = async () => {
    if (!id || !password)
      return alert("아이디와 패스워드를 입력하지 않았습니다.")
    const res = await axios.post("/login", { id, password, longExp })
  
	  if (res.data === "fail") {
      alert("아이디 혹은 비밀번호가 올바르지 않습니다.")
    } else {
      setCookie("token", res.data)
      window.location.href = "/"
    }
  }

  return (
    <div>
      <Head>
        <title>로그인 - 시뮬레이션 커뮤니티 시무</title>
        <meta
          name="description"
          content="만화 아이돌 애니 드라마 미연시 등 각종 장르의 팬픽 시뮬레이션 게임을 제공하는 사이트입니다."
        ></meta>
        <meta
          name="keyword"
          content="만화, 애니, 아이돌, 팬픽, 시뮬레이션, 웹게임, 미연시"
        ></meta>
      </Head>
      <main>
        <section className="hero is-primary is-fullheight-with-navbar">
          <div className="hero-body">
            <div className="container">
              <div className="columns is-centered is-mobile">
                <div className="column is-11-mobile is-5-tablet is-4-desktop is-3-widescreen">
                  <div className="box">
                    <div className="field">
                      <label className="label">아이디</label>
                      <div className="control has-icons-left">
                        <input
                          type="text"
                          placeholder="ID"
                          className="input"
                          value={id}
                          onChange={(e) => setId(e.target.value)}
                          required
                        />
                        <span className="icon is-small is-left">
                          <i className="fa fa-user"></i>
                        </span>
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">패스워드</label>
                      <div className="control has-icons-left">
                        <input
                          type="password"
                          placeholder="*******"
                          className="input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <span className="icon is-small is-left">
                          <i className="fa fa-lock"></i>
                        </span>
                      </div>
                    </div>
                    <div className="field">
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          onChange={(e) => setLongExp(e.target.checked)}
                        />
                        <span className="ml-2">30일간 로그인 유지</span>
                      </label>
                    </div>
                    <div className="row">
                      <div className="field mr-2">
                        <Link href="join">
                          <button type="button" className="button is-primary">
                            가입
                          </button>
                        </Link>
                      </div>
                      <div className="field mr-2">
                        <Link href="findPassword">
                          <button type="button" className="button is-primary">
                            비번찾기
                          </button>
                        </Link>
                      </div>
                      <div className="field ml-2">
                        <button className="button is-success" onClick={submit}>
                          로그인
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default login
