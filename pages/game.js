import React from "react"
import Link from "next/link"

const login = () => {
  return (
    <div>
      <section className="hero is-dark is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                <form action="" className="box">
                  <div className="field">
                    <label className="label">
                      아이디
                    </label>
                    <div className="control has-icons-left">
                      <input
                        type="text"
                        placeholder="input ID"
                        className="input"
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="fa fa-user"></i>
                      </span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">
                      패스워드
                    </label>
                    <div className="control has-icons-left">
                      <input
                        type="password"
                        placeholder="*******"
                        className="input"
                        required
                      />
                      <span className="icon is-small is-left">
                        <i className="fa fa-lock"></i>
                      </span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">
                      이메일 (네이버만)
                    </label>
                    <div className="control has-icons-left">
                      <div className="row">
                        <input
                          type="text"
                          placeholder="naver ID"
                          className="input mr-2"
                          required
                        />
                        <span> @naver.com</span>
                      </div>

                      <span className="icon is-small is-left">
                        <i className="fa fa-envelope"></i>
                      </span>
                    </div>
                  </div>
                  <div className="field row">
                    <button className="button is-success">회원가입</button>
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

export default login
