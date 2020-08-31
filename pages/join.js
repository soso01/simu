import React, { useState } from "react"
import axios from "axios"

const join = () => {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [nickName, setNickName] = useState("")
  const [email, setEmail] = useState("")
  const [isChcek, setIsCheck] = useState(false)
  const [checkNum, setCheckNum] = useState("")
  const [checkResult, setCheckResult] = useState({
    id: false,
    nickName: false,
    checkNum: false,
  })

  const getCertificationNumber = async () => {
    if (!email) return alert("이메일을 입력해 주세요.")
    const result = await axios.post("/join/getCertificationNumber", { email })
    if (result.data === "exist") alert("이미 존재하는 이메일 입니다.")
    else setIsCheck("true")
  }

  const checkCertificationNumber = async () => {
    if (!checkNum) return alert("인증 번호를 입력해 주세요.")
    const res = await axios.post("/join/checkCertificationNumber", {
      email,
      checkNum,
    })
    if (res.data === "success") {
      alert("인증에 성공하였습니다.")
      setCheckResult({ ...checkResult, checkNum: true })
    } else {
      alert("인증 번호가 올바르지 않습니다.")
    }
  }

  const checkExistId = async () => {
    if (!id) return alert("아이디를 입력해 주세요.")
    const result = await axios.post("/join/checkExistId", { id })
    if (result.data === "success") {
      alert("사용할 수 있는 아이디입니다.")
      setCheckResult({ ...checkResult, id: true })
    } else {
      alert("이미 존재하는 아이디 입니다.")
    }
  }

  const checkExistNickName = async () => {
    if (!nickName) return alert("닉네임을 입력해 주세요.")
    const result = await axios.post("/join/checkExistNickName", { nickName })
    if (result.data === "success") {
      alert("사용할 수 있는 닉네임입니다.")
      setCheckResult({ ...checkResult, nickName: true })
    } else {
      alert("이미 존재하는 닉네임 입니다.")
    }
  }

  const submit = async () => {
    if (!checkResult.id) return alert("아이디를 입력해 주세요.")
    else if (!checkResult.nickName) return alert("닉네임을 입력해 주세요.")
    else if (!checkResult.checkNum) return alert("이메일 인증을 완료해 주세요.")
    const result = await axios.post("/join/createUser", {
      id,
      password,
      nickName,
      email,
    })
    if(result.data === "success"){
      window.location.href = '/';
    }
  }

  return (
    <div>
      <section className="hero is-primary is-fullheight-with-navbar">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-6-tablet is-6-desktop is-5-widescreen">
                <form className="box">
                  <div className="field">
                    <label className="label">아이디</label>
                    <div className="control has-icons-left row">
                      <input
                        type="text"
                        placeholder="input ID"
                        className="input"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        readOnly={checkResult.id}
                        required
                      />

                      <span>
                        <button
                          type="button"
                          className="button is-link is-light ml-2"
                          onClick={checkExistId}
                        >
                          중복확인
                        </button>
                      </span>
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
                    <label className="label">닉네임</label>
                    <div className="control has-icons-left row">
                      <input
                        type="text"
                        placeholder="input nickname"
                        className="input"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                        readOnly={checkResult.nickName}
                        required
                      />
                      <span>
                        <button
                          type="button"
                          className="button is-link is-light ml-2"
                          onClick={checkExistNickName}
                        >
                          중복확인
                        </button>
                      </span>
                      <span className="icon is-small is-left">
                        <i className="fa fa-user"></i>
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">이메일 (네이버만)</label>
                    <div className="control has-icons-left">
                      <div className="row">
                        <input
                          type="text"
                          placeholder="naver ID"
                          className="input mr-2"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          readOnly={isChcek}
                          required
                        />
                        <span className="text-centerd"> @naver.com</span>

                        <span>
                          <button
                            type="button"
                            className="button is-link is-light ml-2"
                            onClick={getCertificationNumber}
                            disabled={isChcek}
                          >
                            인증하기
                          </button>
                        </span>
                      </div>

                      <span className="icon is-small is-left">
                        <i className="fa fa-envelope"></i>
                      </span>
                    </div>
                  </div>

                  {isChcek && (
                    <div className="field">
                      <label className="label">이메일 인증번호</label>
                      <div className="control has-icons-left">
                        <div className="row">
                          <input
                            type="text"
                            placeholder="input checkNumber"
                            className="input mr-2"
                            value={checkNum}
                            onChange={(e) => setCheckNum(e.target.value)}
                            required
                          />
                          <span>
                            <button
                              type="button"
                              className="button is-link is-light ml-2"
                              onClick={checkCertificationNumber}
                            >
                              인증하기
                            </button>
                          </span>
                        </div>

                        <span className="icon is-small is-left">
                          <i className="fa fa-check"></i>
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="field row">
                    <button type="button" className="button is-success" onClick={submit}>
                      회원가입
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default join
