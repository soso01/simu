import React, {useEffect, useState} from 'react'
import { useCookies } from "react-cookie"
import axios from 'axios'
import Create from './create'

const update = ({seq}) => {
  const [cookies, setCookies, removeCookies] = useCookies(["token"])
  const [canUpdate, setCanUpdate] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [data, setData] = useState({})

  useEffect(()=> {
    const fetch = async () => {
      const res = await axios.post("/update/getData", {seq, token: cookies.token})
      setIsReady(true)
      if(res.data === "fail")setCanUpdate(false)
      else {
        setCanUpdate(true)
        setData(res.data)
      }
    }
    fetch()
  },[])

  if(!isReady) return <div>Loading..</div>
  else if(!canUpdate) return <div>시뮬레이션의 작성자만 수정할 수 있습니다.</div>
  else return <Create isUpdate={true} data={data}/>
}

export async function getServerSideProps({ req }) {
  return {
    props: {
      seq: req.params.seq,
    }, // will be passed to the page component as props
  }
}

export default update
