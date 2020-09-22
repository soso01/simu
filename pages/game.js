import React, { useState, useEffect } from "react"
import axios from "axios"
import { port } from "../key"
import Modal from "../components/Modal"
import { useRouter } from "next/router"

const game = ({ game }) => {
  const router = useRouter()
  const [isStartModal, setIsStartModal] = useState(true)
  const [isEndModal, setIsEndModal] = useState(false)

  const { pages } = game

  const [pageNum, setPageNum] = useState(0)
  const [scriptNum, setScriptNum] = useState(0)
  const [scriptText, setScriptText] = useState("")
  const [printText, setPrintText] = useState("")
  const [nowScript, setNowScript] = useState(pages[pageNum].script[scriptNum])


  const runAction = (action) => {
    if(action.actType === "movePage"){
      setPageNum(action.num - 1)
    }
    else if(action.actType === "moveScript"){
      setScriptNum(action.num)
    }
    else if (action.actType === "exit") {
      setIsEndModal(true)
    }
  }

  const gameTextClick = () => {
    console.log("clicked")
    console.log(nowScript)
    if(scriptText.length > 0){
      setPrintText(printText + scriptText)
      setScriptText("")
    }
    else {
      if(nowScript.select.length === 0){
        runAction(nowScript.action)
      }
    }
  }

  const textSetting = () => {
    setTimeout( () => {
      if (scriptText.length > 0) {
         setPrintText(printText + scriptText[0])
         setScriptText(scriptText.slice(1))
        textSetting()
      }
    }, 500)
  }

  useEffect(() => {
    setPrintText("")
    setNowScript(pages[pageNum].script[scriptNum])
    setScriptText(pages[pageNum].script[scriptNum].text)
  }, [pageNum, scriptNum])

  useEffect(() => {
    if (!isStartModal && scriptText.length > 0) {
      const addLetter = (setPrintText, setScriptText, printText, scriptText) =>
        setTimeout(() => {
          setPrintText(printText + scriptText[0])
          setScriptText(scriptText.slice(1))
        }, 100)
      addLetter(setPrintText, setScriptText, printText, scriptText)
    }
  }, [scriptText, isStartModal])

  return (
    <div>
      <Modal
        active={isStartModal}
        title={game.title}
        content={game.desc}
        buttonText="시작"
        onClickFunc={() => setIsStartModal(false)}
      />
      <Modal
        active={isEndModal}
        title="시뮬레이션이 종료되었습니다."
        content={
          "응원댓글은 시뮬레이션 제작자에게 큰 힘이됩니다!\n" +
          "수고하셨습니다."
        }
        buttonText="종료"
        onClickFunc={() => router.push("/comment/" + game.seq)}
      />
      <section className="hero is-dark is-bold is-fullheight-with-navbar">
        <div className="hero-body">
          <div className="container is-fullheight" style={{ height: "100%" }}>
            <div className="game-img-box">
              <img
                className="game-img"
                src={"/image/" + pages[pageNum].img}
              ></img>
            </div>
            <div className="game-text-box ml-1 mr-1 is-size-5" onClick={gameTextClick}>
              {printText.split("\n").map((v, i) => (
                <span key={i}>
                  {v} <br />
                </span>
              ))}
              {scriptText.length === 0 &&
                nowScript.select.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    {scriptText.length === 0 &&
                      nowScript.select.map((v, i) => (
                        <p className="textSelect" key={i} onClick={() => runAction(v.action)}>
                          {i} ) {v.text}
                        </p>
                      ))}
                  </div>
                )}
            </div>
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
