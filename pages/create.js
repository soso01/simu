import React, { useState, useEffect } from "react"
import axios from "axios"
import { useCookies } from "react-cookie"
import Login from "./login"
import Spinenr from "../components/Spinner"

const create = () => {
  const [simData, setSimData] = useState({
    title: "",
    desc: "",
    pages: [
      {
        img: "",
        script: [
          {
            text: "",
            action: { actType: "", num: 0 },
            select: [],
          },
        ],
      },
    ],
  })
  const [images, setImages] = useState([])
  const [isLogin, setIsLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cookies, setCookies, removeCookies] = useCookies(["token"])

  console.log(simData)

  useEffect(() => {
    const jwtCheck = async () => {
      const res = await axios.post("/login/jwtVerify", { token: cookies.token })
      if (res.data === "success") setIsLogin(true)
      else {
        setIsLogin(false)
        removeCookies("token")
      }
    }
    if (cookies.token) jwtCheck()
    else setIsLogin(false)
    setIsLoading(true)
  }, [cookies.token])

  const uploadFile = async (e, page) => {
    const file = e.target.files[0]
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/gif" &&
      file.type !== "image/png"
    ) {
      alert("이미지 파일만 업로드 할 수 있습니다. (jpeg, png, gif)")
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("10MB 이하의 이미지만 업로드 할 수 있습니다.")
    } else {
      const formData = new FormData()
      formData.append("file", file)
      const res = await axios.post("/image/upload", formData)
      if (res.data === "fail") alert("이미지 업로드에 실패했습니다.")
      else {
        if(page.img) setImages([...images, page.img])
        page.img = res.data
        setSimData({ ...simData })
      }
    }
  }
  
  const submit = async () => {
    await axios.post('/game/create', {data: simData, token: cookies.token, images})
  }

  if (!isLoading) {
    return <Spinenr></Spinenr>
  }
  if (!isLogin) {
    return <Login></Login>
  } else
    return (
      <div className="columns is-mobile is-centered mt-5">
        <div className="column is-11-mobile is-8-tablet is-6-desktop">
          <div className="box">
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

                {page.img && <div style={{padding: 20, borderWidth: 1, borderRadius: 5}}><img src={"/image/" + page.img}></img></div>}

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
                    {page.img && <span className="file-name">{page.img}</span>}
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
                                  scriptValue.action.actType = e.target.value
                                  setSimData({ ...simData })
                                }}
                                required
                              >
                                <option value="">선택하세요</option>
                                <option value="movePage">페이지 이동</option>
                                <option value="moveScript">
                                  스크립트 이동
                                </option>
                                <option value="exit">시뮬레이션 종료</option>
                              </select>
                            </div>
                            {scriptValue.action.actType &&
                              scriptValue.action.actType !== "exit" && (
                                <div className="select">
                                  <select
                                    value={scriptValue.action.num}
                                    onChange={(e) => {
                                      scriptValue.action.num = e.target.value
                                      setSimData({ ...simData })
                                    }}
                                    required
                                  >
                                    <option value="">선택하세요</option>
                                    {scriptValue.action.actType === "movePage"
                                      ? simData.pages.map(
                                          (optionValue, optionIndex) => (
                                            <option
                                              key={optionIndex}
                                              value={optionIndex + 1}
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

                      {scriptValue.select.map((selectValue, selectIndex) => (
                        <div key={selectIndex}>
                          <div className="row mt-2 mb-2">
                            <span className="mr-4">{selectIndex + 1}</span>
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
                                  onChange={(e) => {
                                    selectValue.action.actType = e.target.value
                                    setSimData({ ...simData })
                                  }}
                                  required
                                >
                                  <option value="">선택하세요</option>
                                  <option value="movePage">페이지 이동</option>
                                  <option value="moveScript">
                                    스크립트 이동
                                  </option>
                                </select>
                              </div>
                              {selectValue.action.actType && (
                                <div className="select">
                                  <select
                                    onChange={(e) => {
                                      selectValue.action.num = e.target.value
                                      setSimData({ ...simData })
                                    }}
                                    required
                                  >
                                    <option value="">선택하세요</option>
                                    {selectValue.action.actType === "movePage"
                                      ? simData.pages.map(
                                          (optionValue, optionIndex) => (
                                            <option value={optionIndex + 1}>
                                              페이지 {optionIndex + 1}
                                            </option>
                                          )
                                        )
                                      : page.script.map(
                                          (optionValue, optionIndex) => (
                                            <option value={optionIndex}>
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
                      ))}
                    </div>
                    <div className="row mt-3 mb-3">
                      <button
                        className="button is-link is-light"
                        onClick={() => {
                          scriptValue.select.push({
                            text: "",
                            action: {
                              actType: "",
                              num: 0,
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
                        action: { actType: "", num: 0 },
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
                        action: { actType: "", num: 0 },
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
            <div className="field row mt-6 mb-6">
              <div className="control">
                <button className="button is-link mr-2" onClick={submit}>생성하기</button>
              </div>
              <div className="control">
                <button className="button is-link is-light ml-2">
                  미리보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default create
