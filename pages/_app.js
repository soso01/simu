import "bulma"
import "../public/scss/global.scss"
import "@fortawesome/fontawesome-free/css/all.min.css"
import React, { useState, createContext } from "react"
import { CookiesProvider } from "react-cookie"
import Nav from "../components/nav"
import Head from "next/head"

export const AppContext = createContext()

export default function MyApp({ Component, pageProps }) {
  const [sortBy, setSortBy] = useState("popular")
  const [dateSort, setDateSort] = useState("all")
  const [searchName, setSearchName] = useState("")
  const initData = {
    sortBy,
    setSortBy,
    dateSort,
    setDateSort,
    searchName,
    setSearchName,
  }
  return (
    <AppContext.Provider value={initData}>
      <CookiesProvider>
        <Head>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-156583131-2"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              
                gtag('config', 'UA-156583131-2');
              `,
            }}
          />
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "ca-pub-7372890615325253",
                enable_page_level_ads: true
              });
              `,
            }}
          />
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
          <Nav />
          <Component {...pageProps} />
      </CookiesProvider>
    </AppContext.Provider>
  )
}
