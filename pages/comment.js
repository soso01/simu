import React from "react"

const comment = () => {
  return (
    <div>
      <section class="hero is-small is-primary">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">제목 입니다</h1>
            <h2 class="subtitle">by 닉네임</h2>
          </div>
        </div>
      </section>

      <div className="columns is-centered mt-6">
        <div className="column is-10-mobile is-8-tablet">
          <div className="box">
            <div class="container mt-3 mb-6">
              <div class="notification">
                어쩌고저쩌고 하는 시뮬레이션입니다. 재밌게 즐겨주세요~
              </div>
            </div>

            <article class="media">
              <div class="media-content">
                <div class="field">
                  <p class="control">
                    <textarea
                      class="textarea"
                      placeholder="Add a comment..."
                    ></textarea>
                  </p>
                </div>
                <nav class="level">
                  <div class="level-left">
                    <div class="level-item">
                      <a class="button is-info">Submit</a>
                    </div>
                  </div>
                </nav>
              </div>
            </article>

            <article class="media">
              <div class="media-content">
                <div class="content">
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
              <div class="media-right">
                <button class="delete"></button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}

export default comment
