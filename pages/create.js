import React, { useState } from "react"

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
            action: { type: "", num: 0 },
            select: [],
          },
        ],
      },
    ],
  })
  console.log(simData)
  return (
    <div className="columns is-mobile is-centered mt-5">
      <div className="column is-8-mobile is-6-tablet">
        <div class="field">
          <label class="label">제목</label>
          <div class="control">
            <input
              class="input"
              type="text"
              value={simData.title}
              onChange={(e) =>
                setSimData({ ...simData, title: e.target.value })
              }
              placeholder="제목을 입력하세요."
            />
          </div>
        </div>

        <div class="field">
          <label class="label">설명</label>
          <div class="control">
            <textarea
              class="textarea"
              value={simData.desc}
              onChange={(e) => setSimData({ ...simData, desc: e.target.value })}
              placeholder="간단한 설명을 입력하세요."
            ></textarea>
          </div>
        </div>

        {simData.pages.map((v, i) => (
          <div className="field" key={i}>
            <hr className="mt-5" />

            <p className="title is-4 row">페이지 {i + 1}
              <button className="button is-danger is-small ml-4"
              onClick={() => {
                if (simData.pages.length === 1) {
                  alert("최소 하나의 페이지는 존재해야 합니다.")
                } else {
                  simData.pages = simData.pages.filter((filterValue) => filterValue !== v)
                  setSimData({ ...simData })
                }
              }}
              >삭제</button>
            </p>

            <div class="file is-boxed is-centered mb-5">
              <label class="file-label">
                <input class="file-input" type="file" name="resume" />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">사진 업로드</span>
                </span>
              </label>
            </div>

            {v.script.map((scriptValue, scriptIndex) => (
              <div key={scriptIndex}>
                <div class="field">
                  <div className="is-grouped row">
                    <label class="label mr-2 has-text-centered">
                      스크립트 {scriptIndex + 1}
                    </label>
                    {
                      <button
                        className="button is-danger is-small mb-2"
                        onClick={() => {
                          if (v.script.length === 1) {
                            alert("페이지에 최소 하나의 스크립트는 존재해야 합니다.")
                          } else {
                            v.script = v.script.filter((v) => v !== scriptValue)
                            setSimData({ ...simData })
                          }
                        }}
                      >
                        삭제
                      </button>
                    }
                  </div>

                  <div class="control">
                    <textarea
                      class="textarea"
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
                      <span className="mr-2">스크립트 액션</span>
                      <div class="control mr-2">
                        <div class="select">
                          <select
                            value={scriptValue.action.type}
                            onChange={(e) => {
                              scriptValue.action.type = e.target.value
                              setSimData({ ...simData })
                            }}
                          >
                            <option value="">선택하세요</option>
                            <option value="movePage">페이지 이동</option>
                            <option value="moveScript">스크립트 이동</option>
                          </select>
                        </div>
                        {scriptValue.action.type && (
                          <div class="select">
                            <select
                              value={scriptValue.action.num}
                              onChange={(e) => {
                                scriptValue.action.num = e.target.value
                                setSimData({ ...simData })
                              }}
                            >
                              <option value="">선택하세요</option>
                              {scriptValue.action.type === "movePage"
                                ? simData.pages.map(
                                    (optionValue, optionIndex) => (
                                      <option value={optionIndex + 1}>
                                        페이지 {optionIndex + 1}
                                      </option>
                                    )
                                  )
                                : v.script.map((optionValue, optionIndex) => (
                                    <option value={optionIndex}>
                                      스크립트 {optionIndex + 1}
                                    </option>
                                  ))}
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
                          class="input"
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
                        <div class="control mr-2">
                          <div class="select">
                            <select
                              onChange={(e) => {
                                selectValue.action.type = e.target.value
                                setSimData({ ...simData })
                              }}
                            >
                              <option value="">선택하세요</option>
                              <option value="movePage">페이지 이동</option>
                              <option value="moveScript">스크립트 이동</option>
                            </select>
                          </div>
                          {selectValue.action.type && (
                            <div class="select">
                              <select
                                onChange={(e) => {
                                  selectValue.action.num = e.target.value
                                  setSimData({ ...simData })
                                }}
                              >
                                <option value="">선택하세요</option>
                                {selectValue.action.type === "movePage"
                                  ? simData.pages.map(
                                      (optionValue, optionIndex) => (
                                        <option value={optionIndex + 1}>
                                          페이지 {optionIndex + 1}
                                        </option>
                                      )
                                    )
                                  : v.script.map((optionValue, optionIndex) => (
                                      <option value={optionIndex}>
                                        스크립트 {optionIndex + 1}
                                      </option>
                                    ))}
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
                    class="button is-link is-light"
                    onClick={() => {
                      scriptValue.select.push({
                        text: "",
                        action: {
                          type: "",
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
                class="button is-link is-light ml-2"
                onClick={() => {
                  v.script.push({
                    text: "",
                    action: { type: "", num: 0 },
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
            class="button is-link is-light ml-2"
            onClick={() => {
              simData.pages.push({
                img: "",
                script: [
                  {
                    text: "",
                    action: { type: "", num: 0 },
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
        <div class="field row mt-6 mb-6">
          <div class="control">
            <button class="button is-link mr-2">생성하기</button>
          </div>
          <div class="control">
            <button class="button is-link is-light ml-2">미리보기</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default create
