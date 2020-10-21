import React, { useState, useEffect } from "react"
import axios from "axios"
import { useCookies } from "react-cookie"
import Login from "./login"
import Head from "next/head"
import Spinenr from "../components/Spinner"
import Game from "./game"

const create = ({ isUpdate, data }) => {
  const [simData, setSimData] = useState({
    title: "",
    desc: "",
    thumbnailNum: 0,
    pages: [
      {
        img: "",
        script: [
          {
            text: "",
            action: { actType: "", num: "" },
            select: [],
          },
        ],
      },
    ],
  })
  const [isLogin, setIsLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [cookies, setCookies, removeCookies] = useCookies(["token"])

  useEffect(() => {
    const jwtCheck = async () => {
      const res = await axios.post("/login/isLogin", { token: cookies.token })
      if (res.data === "success") setIsLogin(true)
      else {
        setIsLogin(false)
      }
      setIsLoading(true)
    }
    if (cookies.token) jwtCheck()
    else {
      setIsLogin(false)
      setIsLoading(true)
    }
  }, [cookies.token])

  useEffect(() => {
    if (isUpdate && data) {
      setSimData({ ...data })
    }
  }, [data])

  const uploadFile = async (e, page) => {
    const file = e.target.files[0]
    if (!file) return null
    else if (
      file.type !== "image/jpeg" &&
      file.type !== "image/gif" &&
      file.type !== "image/png"
    ) {
      alert("이미지 파일만 업로드 할 수 있습니다. (jpeg, png, gif)")
    }
    if (file.size > 20 * 1024 * 1024) {
      alert("20MB 이하의 이미지만 업로드 할 수 있습니다.")
    } else {
      const formData = new FormData()
      formData.append("file", file)
      const res = await axios.post("/image/upload", formData)
      if (res.data === "fail") alert("이미지 업로드에 실패했습니다.")
      else {
        page.img = res.data
        setSimData({ ...simData })
      }
    }
  }

  const submit = async () => {
    const res = await axios.post("/game/create", {
      data: simData,
      isPrivate,
      token: cookies.token,
      isUpdate,
    })
    if (res.data.result === "fail") {
      alert(res.data.msg)
    } else {
      if (isUpdate) alert("수정되었습니다.")
      else alert("생성되었습니다.")
      window.location.href = "/"
    }
  }

  if (!isLoading) {
    return <Spinenr></Spinenr>
  }
  if (!isLogin) {
    return <Login></Login>
  }
  if (isPreview) {
    return (
      <>
        <div className="row">
          <button
            className="button is-info is-small ml-4"
            onClick={() => setIsPreview(!isPreview)}
          >
            미리보기 종료
          </button>
        </div>
        <Game
          game={simData}
          isPreview={true}
          togglePreview={() => setIsPreview(!isPreview)}
        ></Game>
      </>
    )
  } else
    return (
      <div>
        <Head>
          <title>
            {isUpdate ? "수정하기" : "만들기"} - 시뮬레이션 커뮤니티 시무
          </title>
          <meta
            name="description"
            content="만화 아이돌 애니 드라마 미연시 등 각종 장르의 팬픽 시뮬레이션 게임을 제공하는 사이트입니다."
          ></meta>
          <meta
            name="keyword"
            content="만화, 애니, 아이돌, 팬픽, 시뮬레이션, 웹게임, 미연시"
          ></meta>
        </Head>
        <main>
          <div className="columns is-mobile is-centered mt-5">
            <div className="column is-11-mobile is-8-tablet is-6-desktop">
              <div className="box">
                <article className="message is-link">
                  <div className="message-header">
                    <p>도움말</p>
                  </div>
                  <div className="message-body">
                    <p>
                      -{" "}
                      <a href="https://simu.kr/game/2" target="_blank">
                        글쓰기 튜토리얼 링크
                      </a>
                    </p>
                    <p>- 페이지 : 이미지 단위의 구분</p>
                    <p>- 스크립트 : 같은 페이지 내의 텍스트의 구분</p>
                    <p>- 모든 페이지에는 이미지가 반드시 필요합니다.</p>
                    <p>
                      - 모든 페이지의 스크립트와 선택지에는 액션이 필요합니다.
                    </p>
                    <p>
                      - 반드시 하나 이상의 시뮬레이션 종료 액션이 필요합니다.
                    </p>
                    <p>
                      - 모든 스크립트는 시뮬레이션 종료 액션으로 이어질 수
                      있어야 합니다.
                    </p>
                    <p>
                      - 성적 표현이 있거나, 도배등 비정상적인 게시물은 통보없이
                      삭제될 수 있습니다.
                    </p>
                    <p>
                      - 비공개 글 등록 기능으로 작성 틈틈이 임시저장해주세요.
                    </p>
                  </div>
                </article>
                <div className="field">
                  <label className="label">제목</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={simData.title}
                      onChange={(e) =>
                        setSimData({ ...simData, title: e.target.value })
                      }
                      placeholder="제목을 입력하세요."
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">설명</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      value={simData.desc}
                      onChange={(e) =>
                        setSimData({ ...simData, desc: e.target.value })
                      }
                      placeholder="간단한 설명을 입력하세요."
                    ></textarea>
                  </div>
                </div>

                {simData.pages.map((page, i) => (
                  <div className="field" key={i}>
                    <hr className="mt-5" />

                    <p className="title is-4 row">
                      페이지 {i + 1}
                      {i === simData.thumbnailNum ? (
                        <button className="button is-info is-small ml-4">
                          현재 썸네일
                        </button>
                      ) : (
                        <button
                          className="button is-success is-small ml-4"
                          onClick={() => {
                            setSimData({ ...simData, thumbnailNum: i })
                          }}
                        >
                          썸네일 설정
                        </button>
                      )}
                      <button
                        className="button is-danger is-small ml-4"
                        onClick={() => {
                          if (simData.pages.length === 1) {
                            alert("최소 하나의 페이지는 존재해야 합니다.")
                          } else {
                            simData.pages = simData.pages.filter(
                              (filterValue) => filterValue !== page
                            )
                            setSimData({ ...simData })
                          }
                        }}
                      >
                        삭제
                      </button>
                    </p>

                    {page.img && (
                      <div
                        style={{ padding: 20, borderWidth: 1, borderRadius: 5 }}
                      >
                        <img src={"/image/" + page.img}></img>
                      </div>
                    )}

                    <div className="file has-name is-boxed is-centered mb-5">
                      <label className="file-label">
                        <input
                          className="file-input"
                          type="file"
                          onChange={(e) => uploadFile(e, page)}
                          accept="image/gif, image/jpeg, image/png"
                          name="resume"
                        />
                        <span className="file-cta">
                          <span className="file-icon">
                            <i className="fas fa-upload"></i>
                          </span>
                          <span className="file-label">사진 업로드</span>
                        </span>
                        {page.img && (
                          <span className="file-name">{page.img}</span>
                        )}
                      </label>
                    </div>

                    {page.script.map((scriptValue, scriptIndex) => (
                      <div key={scriptIndex}>
                        <div className="field">
                          <div className="is-grouped row">
                            <label className="label mr-2 has-text-centered">
                              스크립트 {scriptIndex + 1}
                            </label>
                            {
                              <button
                                className="button is-danger is-small mb-2"
                                onClick={() => {
                                  if (page.script.length === 1) {
                                    alert(
                                      "페이지에 최소 하나의 스크립트는 존재해야 합니다."
                                    )
                                  } else {
                                    page.script = page.script.filter(
                                      (v) => v !== scriptValue
                                    )
                                    setSimData({ ...simData })
                                  }
                                }}
                              >
                                삭제
                              </button>
                            }
                          </div>

                          <div className="control">
                            <textarea
                              className="textarea"
                              value={scriptValue.text}
                              onChange={(e) => {
                                scriptValue.text = e.target.value
                                setSimData({
                                  ...simData,
                                  pages: [...simData.pages],
                                })
                              }}
                              placeholder="대화 스크립트 입력"
                            ></textarea>
                          </div>

                          {scriptValue.select.length === 0 && (
                            <div className="row">
                              <span className="mr-2 mt-2">스크립트 액션</span>
                              <div className="control mr-2">
                                <div className="select">
                                  <select
                                    value={scriptValue.action.actType}
                                    onChange={(e) => {
                                      scriptValue.action.actType =
                                        e.target.value
                                      setSimData({ ...simData })
                                    }}
                                    required
                                  >
                                    <option value="">선택하세요</option>
                                    <option value="movePage">
                                      페이지 이동
                                    </option>
                                    <option value="moveScript">
                                      스크립트 이동
                                    </option>
                                    <option value="exit">
                                      시뮬레이션 종료
                                    </option>
                                  </select>
                                </div>
                                {scriptValue.action.actType &&
                                  scriptValue.action.actType !== "exit" && (
                                    <div className="select">
                                      <select
                                        value={scriptValue.action.num}
                                        onChange={(e) => {
                                          scriptValue.action.num =
                                            e.target.value
                                          setSimData({ ...simData })
                                        }}
                                        required
                                      >
                                        <option value="">선택하세요</option>
                                        {scriptValue.action.actType ===
                                        "movePage"
                                          ? simData.pages.map(
                                              (optionValue, optionIndex) => (
                                                <option
                                                  key={optionIndex}
                                                  value={optionIndex}
                                                >
                                                  페이지 {optionIndex + 1}
                                                </option>
                                              )
                                            )
                                          : page.script.map(
                                              (optionValue, optionIndex) => (
                                                <option
                                                  key={optionIndex}
                                                  value={optionIndex}
                                                >
                                                  스크립트 {optionIndex + 1}
                                                </option>
                                              )
                                            )}
                                      </select>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}

                          {scriptValue.select.map(
                            (selectValue, selectIndex) => (
                              <div key={selectIndex}>
                                <div className="row mt-2 mb-2">
                                  <span className="mr-4">
                                    {selectIndex + 1}
                                  </span>
                                  <input
                                    className="input"
                                    type="text"
                                    value={selectValue.text}
                                    onChange={(e) => {
                                      selectValue.text = e.target.value
                                      setSimData({ ...simData })
                                    }}
                                    placeholder="선택지 입력"
                                  />
                                  <button
                                    className="button is-danger ml-2"
                                    onClick={() => {
                                      scriptValue.select = scriptValue.select.filter(
                                        (v) => v !== selectValue
                                      )
                                      setSimData({ ...simData })
                                    }}
                                  >
                                    삭제
                                  </button>
                                </div>

                                <div className="row">
                                  <span className="mr-2">
                                    선택지 {selectIndex + 1} 액션
                                  </span>
                                  <div className="control mr-2">
                                    <div className="select">
                                      <select
                                        value={selectValue.action.actType}
                                        onChange={(e) => {
                                          selectValue.action.actType =
                                            e.target.value
                                          setSimData({ ...simData })
                                        }}
                                        required
                                      >
                                        <option value="">선택하세요</option>
                                        <option value="movePage">
                                          페이지 이동
                                        </option>
                                        <option value="moveScript">
                                          스크립트 이동
                                        </option>
                                      </select>
                                    </div>
                                    {selectValue.action.actType && (
                                      <div className="select">
                                        <select
                                          value={selectValue.action.num}
                                          onChange={(e) => {
                                            selectValue.action.num =
                                              e.target.value
                                            setSimData({ ...simData })
                                          }}
                                          required
                                        >
                                          <option value="">선택하세요</option>
                                          {selectValue.action.actType ===
                                          "movePage"
                                            ? simData.pages.map(
                                                (optionValue, optionIndex) => (
                                                  <option
                                                    key={optionIndex}
                                                    value={optionIndex}
                                                  >
                                                    페이지 {optionIndex + 1}
                                                  </option>
                                                )
                                              )
                                            : page.script.map(
                                                (optionValue, optionIndex) => (
                                                  <option
                                                    key={optionIndex}
                                                    value={optionIndex}
                                                  >
                                                    스크립트 {optionIndex + 1}
                                                  </option>
                                                )
                                              )}
                                        </select>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                        <div className="row mt-3 mb-3">
                          <button
                            className="button is-link is-light"
                            onClick={() => {
                              scriptValue.select.push({
                                text: "",
                                action: {
                                  actType: "",
                                  num: "",
                                },
                              })
                              setSimData({ ...simData })
                            }}
                          >
                            선택지 추가
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="row">
                      <button
                        className="button is-link is-light ml-2"
                        onClick={() => {
                          page.script.push({
                            text: "",
                            action: { actType: "", num: "" },
                            select: [],
                          })
                          setSimData({ ...simData })
                        }}
                      >
                        스크립트 추가
                      </button>
                    </div>
                  </div>
                ))}
                <div className="row">
                  <button
                    className="button is-link is-light ml-2"
                    onClick={() => {
                      simData.pages.push({
                        img: "",
                        script: [
                          {
                            text: "",
                            action: { actType: "", num: "" },
                            select: [],
                          },
                        ],
                      })
                      setSimData({ ...simData })
                    }}
                  >
                    페이지 추가
                  </button>
                </div>

                <div className="field mt-6 mb-6">
                  <div className="control row mb-2">
                    <span className="mt-2 mr-2"> 공개 여부 : </span>
                    <div className="select">
                      <select
                        value={isPrivate}
                        onChange={(e) => {
                          setIsPrivate(e.target.value)
                        }}
                      >
                        <option value={false}>공개</option>
                        <option value={true}>비공개</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="control">
                      <button
                        className="button is-link mr-2"
                        onClick={() => submit()}
                      >
                        {isUpdate ? "수정하기" : "생성하기"}
                      </button>
                    </div>
                    <div className="control">
                      <button
                        className="button is-link is-light ml-2"
                        onClick={() => setIsPreview(!isPreview)}
                      >
                        미리보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
}

export default create
