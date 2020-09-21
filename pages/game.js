import React from "react"
import Link from "next/link"

const game = () => {
  return (
    <div>
      <section className="hero is-dark is-bold is-fullheight-with-navbar">
        <div className="hero-body">
          <div className="container is-fullheight" style={{height: "100%"}}>
            <div className="game-img-box">
              <img className="game-img" src="https://i.pinimg.com/originals/98/e8/a5/98e8a557d515cf2616d4119979455677.gif"></img>
            </div>
            <div className="game-text-box ml-1 mr-1 is-size-5">반가워..</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default game
