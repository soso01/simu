import React from "react"
import Link from 'next/link'

const Card = () => {
  return (
    <div className="" style={{ width: 350, margin: 20 }}>
      <div className="column card">
        <div className="card-image">
          <figure className="image is-4by3">
            <img
              src="https://image.yes24.com/momo/TopCate2750/MidCate008/274974188.jpg"
              alt="Placeholder image"
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="content">
            <p className="title is-4">
              엘사와 학교가기
            </p>
          </div>

          <div className="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            nec iaculis mauris. <a>@bulmaio</a>.<a href="#">#css</a>{" "}
            <a href="#">#responsive</a>
            <br />
            <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time>
          </div>
        </div>

        <footer className="card-footer">
          <Link href="game">
            <a className="card-footer-item">시작하기</a>
          </Link>
          <Link href="comment">
            <a className="card-footer-item">댓글보기</a>
          </Link>
        </footer>
      </div>
    </div>
  )
}

export default Card
