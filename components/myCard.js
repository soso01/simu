import React from "react"
import Link from "next/link"
import router from 'next/router'
import axios from 'axios'
import { useCookies } from "react-cookie"
import moment from "moment"
import "moment/locale/ko"
moment.locale("kr")

const Card = ({ data }) => {
  const [cookies, setCookies, removeCookies] = useCookies(["token"])
  const slicedDesc = data.desc.slice(0, 50)

  const deleteGame = async () => {
    if(confirm("정말로 삭제하시겠습니까?")){
      const res = await axios.post("/game/delete", {token: cookies.token, seq: data.seq})
      alert(res.data.msg) 
      if(res.data.result === "success") router.reload()
    }
  }

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
            <a className="card-footer-item">시작</a>
          </Link>
          <Link href={"/comment/" + data.seq}>
            <a className="card-footer-item">댓글</a>
          </Link>

          <Link href={"/game/" + data.seq}>
            <a className="card-footer-item">수정</a>
          </Link>
            <a onClick={deleteGame} className="card-footer-item">삭제</a>
        </footer>
      </div>
    </div>
  )
}

export default Card
