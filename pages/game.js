import React, { useState } from "react"
import axios from "axios"
import { port } from "../key"
import Modal from '../components/Modal'

const game = ({ game }) => {
  const [isStartModal, setIsStartModal] = useState(true)
  const [isExitModal, setIsExitModal] = useState(false)

  return <Modal active={isStartModal} title={game.title} content={game.desc} />

  return (
    <div>
      <section className="hero is-dark is-bold is-fullheight-with-navbar">
        <div className="hero-body">
          <div className="container is-fullheight" style={{ height: "100%" }}>
            <div className="game-img-box">
              <img
                className="game-img"
                src="https://i.pinimg.com/originals/98/e8/a5/98e8a557d515cf2616d4119979455677.gif"
              ></img>
            </div>
            <div className="game-text-box ml-1 mr-1 is-size-5">반가워..</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const game = await axios.post("http://localhost:" + port + "/game/getGame", {
    seq: req.params.seq,
  })
  console.log(game.data)
  return {
    props: {
      game: game.data,
    }, // will be passed to the page component as props
  }
}

export default game
