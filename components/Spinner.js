import React from "react"

const Spinner = () => {
  return (
    <div className="columns is-mobile is-vcentered" style={{height: "80vh"}}>
      <div className="column">
        <div class="loader">Loading...</div>
      </div>
    </div>
  )
}

export default Spinner
