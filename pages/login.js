import React from "react"
import Link from 'next/link'

const login = () => {
  return (
    <div>
      <section class="hero is-primary is-fullheight">
        <div class="hero-body">
          <div class="container">
            <div class="columns is-centered">
              <div class="column is-5-tablet is-4-desktop is-3-widescreen">
                <form action="" class="box">
                  <div class="field">
                    <label for="" class="label">
                      아이디
                    </label>
                    <div class="control has-icons-left">
                      <input
                        type="email"
                        placeholder="input ID"
                        class="input"
                        required
                      />
                      <span class="icon is-small is-left">
                        <i class="fa fa-envelope"></i>
                      </span>
                    </div>
                  </div>
                  <div class="field">
                    <label for="" class="label">
                      패스워드
                    </label>
                    <div class="control has-icons-left">
                      <input
                        type="password"
                        placeholder="*******"
                        class="input"
                        required
                      />
                      <span class="icon is-small is-left">
                        <i class="fa fa-lock"></i>
                      </span>
                    </div>
                  </div>
                  <div class="field">
                    <label for="" class="checkbox">
                      <input type="checkbox" />
                      Remember me
                    </label>
                  </div>
                  <div className="row">
                    <div class="field mr-2">
                      <Link href="join">
                        <button class="button is-primary">가입</button>
                      </Link>
                    </div>
                    <div class="field ml-2">
                      <button class="button is-success">로그인</button>
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
