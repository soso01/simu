import axios from "axios"
import React, { useState, useEffect } from "react"
import Head from "next/head"
import { useCookies } from "react-cookie"

const passwordChange = () => {
  const [cookies, setCookies, removeCookies] = useCookies(["token"])
  const [isReady, setIsReady] = useState(false)
  const [isLogin, setIsLogin] = useState(false)

  const [nowPassword, setNowPassword] = useState("")
  const [changePassword, setChangePassword] = useState("")
  const [changePassword2, setChangePassword2] = useState("")

  useEffect(() => {
    const loginCheck = async () => {
      const res = await axios.post("/login/isLogin", { token: cookies.token })
      if (res.data === "success") setIsLogin(true)
      setIsReady(true)
    }
    loginCheck()
  }, null)

  const submit = async () => {
    if (changePassword !== changePassword2) {
      return alert("변경할 비밀번호 재입력이 일치하지 않습니다.")
    }
    const res = await axios.post("/login/changePassword", {
      token: cookies.token,
      nowPassword,
      changePassword,
    })
    alert(res.data.msg)
    if (res.data.result === "success") {
      window.location.href = "/"
    }
  }

  if (!isReady) return <div>Loding...</div>
  else if (!isLogin) return <div>로그인이 필요합니다.</div>
  else
    return (
      <div>
        <Head>
          <title>비밀번호 변경 - 시뮬레이션 커뮤니티 시무</title>
          <meta
            name="description"
            content="만화 아이돌 애니 드라마 미연시 등 각종 장르의 팬픽 시뮬레이션 게임을 제공하는 사이트입니다."
          ></meta>
          <meta
            name="keyword"
            content="만화, 애니, 아이돌, 팬픽, 시뮬레이션, 웹게임, 미연시"
          ></meta>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <section className="hero is-primary is-fullheight-with-navbar">
            <div className="hero-body">
              <div className="container">
                <div className="columns is-centered is-mobile">
                  <div className="column is-11-mobile is-5-tablet is-4-desktop is-3-widescreen">
                    <div className="box">
                      <div className="field">
                        <label className="label">현재 비밀번호</label>
                        <div className="control has-icons-left">
                          <input
                            type="password"
                            placeholder="*******"
                            className="input"
                            value={nowPassword}
                            onChange={(e) => setNowPassword(e.target.value)}
                            required
                          />
                          <span className="icon is-small is-left">
                            <i className="fa fa-lock"></i>
                          </span>
                        </div>
                      </div>
                      <div className="field">
                        <label className="label">변경할 비밀번호</label>
                        <div className="control has-icons-left">
                          <input
                            type="password"
                            placeholder="*******"
                            className="input"
                            value={changePassword}
                            onChange={(e) => setChangePassword(e.target.value)}
                            required
                          />
                          <span className="icon is-small is-left">
                            <i className="fa fa-lock"></i>
                          </span>
                        </div>
                      </div>
                      <div className="field">
                        <label className="label">변경할 비밀번호 재입력</label>
                        <div className="control has-icons-left">
                          <input
                            type="password"
                            placeholder="*******"
                            className="input"
                            value={changePassword2}
                            onChange={(e) => setChangePassword2(e.target.value)}
                            required
                          />
                          <span className="icon is-small is-left">
                            <i className="fa fa-lock"></i>
                          </span>
                        </div>
                      </div>

                      <div className="row">
                        <button
                          type="button"
                          className="button is-info"
                          onClick={submit}
                        >
                          변경하기
                        </button>
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

export default passwordChange
