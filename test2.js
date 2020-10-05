const a = {
  _id: { $oid: "5f7a73833a1ebe10bce83538" },
  thumbnail: "thumb_다운로드-20201005101231.webp",
  count: 0,
  accuseCount: 0,
  accuser: [],
  recommendCount: 0,
  recommender: [],
  title: "선택지테스트2",
  desc: "테스트트트1231312332",
  pages: [
    {
      _id: { $oid: "5f7a73833a1ebe10bce83539" },
      img: "다운로드-20201005101231.webp",
      script: [
        {
          _id: { $oid: "5f7a73833a1ebe10bce8353a" },
          text: "이동하기",
          action: { actType: "", num: null },
          select: [
            {
              _id: { $oid: "5f7a73833a1ebe10bce8353b" },
              text: "페이지2",
              action: { actType: "movePage", num: 1 },
              visit: true,
              canExit: false,
            },
            {
              _id: { $oid: "5f7a73833a1ebe10bce8353c" },
              text: "3",
              action: { actType: "movePage", num: 2 },
              visit: true,
              canExit: false,
            },
            {
              _id: { $oid: "5f7a73833a1ebe10bce8353d" },
              text: "4",
              action: { actType: "movePage", num: 3 },
              visit: true,
              canExit: false,
            },
            {
              _id: { $oid: "5f7a73833a1ebe10bce8353e" },
              text: "5",
              action: { actType: "movePage", num: 4 },
              visit: true,
              canExit: false,
            },
          ],
          visit: true,
        },
      ],
    },
    {
      _id: { $oid: "5f7a73833a1ebe10bce8353f" },
      img: "다운로드-20201005101414.webp",
      script: [
        {
          _id: { $oid: "5f7a73833a1ebe10bce83540" },
          text: "",
          action: { actType: "movePage", num: 2 },
          select: [],
          visit: true,
          canExit: false,
        },
      ],
    },
    {
      _id: { $oid: "5f7a73833a1ebe10bce83541" },
      img: "다운로드-20201005101417.webp",
      script: [
        {
          _id: { $oid: "5f7a73833a1ebe10bce83542" },
          text: "",
          action: { actType: "movePage", num: 4 },
          select: [],
          visit: true,
          canExit: false,
        },
      ],
    },
    {
      _id: { $oid: "5f7a73833a1ebe10bce83543" },
      img: "다운로드-20201005101427.webp",
      script: [
        {
          _id: { $oid: "5f7a73833a1ebe10bce83544" },
          text: "",
          action: { actType: "movePage", num: 3 },
          select: [],
          visit: true,
          canExit: false,
        },
      ],
    },
    {
      _id: { $oid: "5f7a73833a1ebe10bce83545" },
      img: "다운로드-20201005101423.webp",
      script: [
        {
          _id: { $oid: "5f7a73833a1ebe10bce83546" },
          text: "",
          action: { actType: "exits", num: null },
          select: [],
          visit: true,
          canExit: false,
        },
      ],
    },
  ],
  userId: "admin",
  nickName: "관리자",
  created: { $date: "2020-10-05T01:14:43.414Z" },
  seq: 27,
  __v: 0,
}
