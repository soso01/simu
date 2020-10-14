import React, { useState } from "react"

const Modal = ({
  active,
  onClickFunc,
  title,
  content,
  buttonText,
  restartText,
  restartFunc,
}) => {
  return (
    <div className={"modal " + (active && "is-active")}>
      <div className="modal-background" onClick={onClickFunc}></div>
      <div className="modal-card" style={{ margin: 0, maxHeight: "60vh" }}>
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClickFunc}
          ></button>
        </header>
        <section
          className="modal-card-body"
          style={{ wordBreak: "break-word" }}
        >
          {content.split("\n").map((v, i) => (
            <span key={i}>
              {v} <br />
            </span>
          ))}
        </section>
        <footer className="modal-card-foot row">
          {restartText && (
            <button className="button" onClick={restartFunc}>
              {restartText}
            </button>
          )}
          <button className="button" onClick={onClickFunc}>
            {buttonText}
          </button>
        </footer>
      </div>
    </div>
  )
}

export default Modal
