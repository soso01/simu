import axios from "axios"
import React, { useState } from "react"

const passwordChange = () => {
  const [id, setId] = useState("")
  const [email, setEmail] = useState("")

  const submit = async () => {
    const res = await axios.post("/join/findPassword", {
      id, email
    })
    alert(res.data.msg)
    if(res.data.result === "success"){
      window.location.href = "/login"
    }
  }

    return (
      <div>
        <section className="hero is-primary is-fullheight-with-navbar">
          <div className="hero-body">
            <div className="container">
              <div className="columns is-centered is-mobile">
                <div className="column is-11-mobile is-5-tablet is-4-desktop is-3-widescreen">
                  <div className="box">

                  <div className="field">
                    <label className="label">
                      아이디
                    </label>
                    <div className="control has-icons-left">
                      <input
                        type="text"
                        placeholder="ID"
                        className="input"
                        value={id}
                        onChange={e => setId(e.target.value)}
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="fa fa-user"></i>
                      </span>
                    </div>
                  </div>
                    
                  <div className="field">
                    <label className="label">가입한 이메일 입력</label>
                    <div className="control has-icons-left">
                      <div className="row">
                        <input
                          type="text"
                          placeholder="naver ID"
                          className="input mr-2"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <span className="text-centerd"> @naver.com</span>
                      </div>

                      <span className="icon is-small is-left">
                        <i className="fa fa-envelope"></i>
                      </span>
                    </div>
                  </div>

                    <div className="row">
                      <button
                        type="button"
                        className="button is-info"
                        onClick={submit}
                      >
                        찾기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
}

export default passwordChange
