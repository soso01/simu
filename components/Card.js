import React from "react"
import Link from "next/link"

const Card = ({ data }) => {
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
            {data.desc}
            <time dateTime="2016-1-1">{data.created}</time>
          </div>
        </div>

        <footer className="card-footer">
          <Link href={"/game/" + data.seq}>
            <a className="card-footer-item">시작하기</a>
          </Link>
          <Link href={"/comment/" + data.seq}>
            <a className="card-footer-item">댓글보기</a>
          </Link>
        </footer>
      </div>
    </div>
  )
}

export default Card
