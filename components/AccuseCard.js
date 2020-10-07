import React from "react"
import Link from "next/link"
import moment from "moment"
import "moment/locale/ko"
moment.locale("kr")

const Card = ({ data, clearAccuseGame }) => {
  const slicedDesc = data.desc.slice(0, 50)
  return (
    <div className="" style={{ width: 350, margin: 20 }}>
      <div className="column card">
        <div className="card-image">
          <figure
            className="image"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <img
              src={"/image/" + data.thumbnail}
              alt="Placeholder image"
              style={{
                width: "300px",
                height: "300px",
              }}
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="content">
            <span className="title is-4">{data.title}</span>
          </div>

          <div className="content">
            {slicedDesc}
            <br />
            <time dateTime="2016-1-1">{moment(data.created).format("LLL")}</time>
          </div>
        </div>

        <footer className="card-footer">
          <Link href={"/game/" + data.seq}>
            <a className="card-footer-item">시작하기</a>
          </Link>
            <a className="card-footer-item" onClick={clearAccuseGame}>신고초기화</a>
            <a className="card-footer-item" onClick={deleteAccuseGame}>삭제하기</a>
        </footer>
      </div>
    </div>
  )
}

export default Card
