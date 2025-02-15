import { MdClose } from 'react-icons/md'
import styled, { keyframes } from 'styled-components'
import { MENU_WIDTH } from '~/components/App/SideBar'
import { Button } from '~/components/Button'
import { Flex } from '~/components/common/Flex'
import { Text } from '~/components/common/Text'
import { useAppStore } from '~/stores/useAppStore'
import { NodeExtended } from '~/types'
import { colors } from '~/utils/colors'

const copiedAnimation = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`

const copyNodeText = (text: string | undefined) => {
  if (text === undefined) {
    return
  }

  navigator.clipboard.writeText(text)

  const copyButton = document.querySelector('.copy-button')

  if (copyButton) {
    copyButton.classList.add('copied')

    setTimeout(() => {
      copyButton.classList.remove('copied')
    }, 1000)
  }
}

type TranscriptProps = {
  stateless?: boolean
  node: NodeExtended | null
}

export const Transcript = ({ stateless, node }: TranscriptProps) => {
  const [transcriptIsOpen, setTranscriptOpen] = useAppStore((s) => [s.transcriptIsOpen, s.setTranscriptOpen])

  if (!stateless && !transcriptIsOpen) {
    return null
  }

  return (
    <Wrapper style={{ left: MENU_WIDTH }}>
      <Flex align="center" direction="row" justify="space-between">
        {stateless && <Text kind="heading">Transcript</Text>}

        {node?.text ? (
          <CopyButton className="copy-button" kind="small" onPointerDown={() => copyNodeText(node?.text)} type="button">
            Copy Transcript
          </CopyButton>
        ) : (
          <div />
        )}

        {!stateless && (
          <CloseButton
            onClick={() => {
              setTranscriptOpen(false)
            }}
          >
            <MdClose fontSize={35} />
          </CloseButton>
        )}
      </Flex>

      <Box>{node?.text ? `"${node?.text}"` : '...'}</Box>
    </Wrapper>
  )
}

const Wrapper = styled(Flex)`
  display: flex;
`

const CloseButton = styled(Flex).attrs({})`
  color: ${colors.mainBottomIcons};
  cursor: pointer;
  &:hover {
    color: ${colors.lightBlue500};
  }
`

const CopyButton = styled(Button)`
  &.copied::after {
    content: 'Copied!';
    position: absolute;
    top: 10px;
    left: 10px;
    background: ${colors.lightGray};
    border-radius: 4px;
    padding: 2px 3px;
    color: ${colors.white};
    animation: ${copiedAnimation} 0.2s ease-in-out;
  }
`

const Box = styled(Flex)`
  color: ${colors.white};
  margin-top: 20px;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  font-style: italic;
`
