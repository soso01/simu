import React from "react"

const comment = () => {
  return (
    <div>
      <section className="hero is-small is-primary">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">제목 입니다</h1>
            <h2 className="subtitle">by 닉네임</h2>
          </div>
        </div>
      </section>

      <div className="columns is-centered mt-6">
        <div className="column is-10-mobile is-8-tablet">
          <div className="box">
            <div className="container mt-3 mb-6">
              <div className="notification">
                어쩌고저쩌고 하는 시뮬레이션입니다. 재밌게 즐겨주세요~
              </div>
            </div>

            <article className="media">
              <div className="media-content">
                <div className="field">
                  <p className="control">
                    <textarea
                      className="textarea"
                      placeholder="Add a comment..."
                    ></textarea>
                  </p>
                </div>
                <nav className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <a className="button is-info">Submit</a>
                    </div>
                  </div>
                </nav>
              </div>
            </article>

            <article className="media">
              <div className="media-content">
                <div className="content">
                  <p>
                    <strong>John Smith</strong> <small>@johnsmith</small>{" "}
                    <small>31m</small>
                    <br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Proin ornare magna eros, eu pellentesque tortor vestibulum
                    ut. Maecenas non massa sem. Etiam finibus odio quis feugiat
                    facilisis.
                  </p>
                </div>
              </div>
              <div className="media-right">
                <button className="delete"></button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}

export default comment
