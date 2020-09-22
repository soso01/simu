import React, { useState } from "react"

const Modal = ({ active, title, content }) => {
  const [isActive, setIsActive] = useState(active === true)

  return (
    <div className={"modal " + (isActive && "is-active")}>
      <div className="modal-background" onClick={() => setIsActive(false)}></div>
      <div className="modal-card" style={{ margin: 0, maxHeight: "60vh" }}>
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button
            className="delete"
            aria-label="close"
            onClick={() => setIsActive(false)}
          ></button>
        </header>
        <section className="modal-card-body" style={{wordBreak:"break-word", whiteSpace: 'pre'}}>
          {content}
        </section>
        <footer className="modal-card-foot row">
          <button className="button" onClick={() => setIsActive(false)}>
            종료
          </button>
        </footer>
      </div>
    </div>
  )
}

export default Modal
