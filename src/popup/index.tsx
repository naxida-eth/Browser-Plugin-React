import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { WagmiProvider } from "wagmi"

import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"

import { config } from "./wagmi-config"

const queryClient = new QueryClient()

function IndexPopup() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [txHash, setTxHash] = useState(undefined)
  const [txInput, setTxInput] = useState(0)
  const [selector, setSelector] = useState("#itero")

  const [csResponse, setCsData] = useState("")

  useEffect(() => {
    window.addEventListener("message", (event) => {
      console.log("EVAL output: " + event.data)
    })
  }, [])

  //   const resp = useCallback(async () => {
  //     const res = await sendToBackground({
  //       name: "ping",
  //       body: {
  //         id: ""
  //       }
  //     })
  //     console.log("resp", res)
  //   }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <StyledContainer>
          <StyledContainerHeader>Header</StyledContainerHeader>
          {/* <button
            onClick={() => {
              resp()
            }}>
            send message
          </button> */}
          <div style={{ flex: 1 }}>
            <input
              type="number"
              value={txInput}
              onChange={(e) => setTxInput(e.target.valueAsNumber)}
            />

            <button
              onClick={async () => {
                const resp = await sendToBackground({
                  name: "hash-tx",
                  body: {
                    input: txInput
                  }
                })
                setTxHash(resp)
              }}>
              Hash TX
            </button>

            <p>TX HASH: {txHash}</p>
            <hr />

            <input
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
            />

            <button
              onClick={async () => {
                const csResponse = await sendToContentScript({
                  name: "query-selector-text",
                  body: selector
                })
                setCsData(csResponse)
              }}>
              Query Text on Web Page
            </button>
            <br />
            <label>Text Data:</label>
            <p>{csResponse}</p>
            <footer>Crafted by @PlamoHQ</footer>
          </div>
        </StyledContainer>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default IndexPopup

const StyledContainerHeader = styled.div`
  height: 60px;
  width: 100vw;
`

const StyledContainer = styled.div`
  max-width: 360px;
  min-height: 600px;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`
