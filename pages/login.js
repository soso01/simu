import React from "react"
import Link from 'next/link'

const login = () => {
  return (
    <div>
      <section className="hero is-primary is-fullheight-with-navbar">
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
                        placeholder="ID"
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
                    <label className="checkbox">
                      <input type="checkbox" />
                      Remember me
                    </label>
                  </div>
                  <div className="row">
                    <div className="field mr-2">
                      <Link href="join">
                        <button className="button is-primary">가입</button>
                      </Link>
                    </div>
                    <div className="field ml-2">
                      <button className="button is-success">로그인</button>
                    </div>
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
