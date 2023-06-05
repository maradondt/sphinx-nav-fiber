import { Float, Html } from '@react-three/drei'

import styled, { css } from 'styled-components'
import { Vector3 } from 'three'
import { defaultDimensions, withTranscriptDimensions } from './constants'

type Props = {
  children: React.ReactNode
  speed?: number
  position: Vector3
  intensity?: number
  withTranscript?: boolean
  visible: boolean
}

export const HtmlPanel = ({ speed = 2, intensity = 4, children, withTranscript, position, visible }: Props) => (
  <Float
    floatingRange={[1, 2]}
    /* Up/down float intensity, works like a multiplier with floatingRange,defaults to 1 */
    floatIntensity={intensity}
    /* Animation speed, defaults to 1 */
    position={position}
    speed={speed}
  >
    <Html
      center
      className="html-panel"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerOut={(e) => e.stopPropagation()}
      onPointerOver={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      sprite
    >
      <HtmlWrap
        className="html-panel"
        dimensions={withTranscript ? withTranscriptDimensions : defaultDimensions}
        id="html-panel"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerOut={(e) => e.stopPropagation()}
        onPointerOver={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        visible={visible}
      >
        {children}
      </HtmlWrap>
    </Html>
  </Float>
)

HtmlPanel.displayName = 'HtmlPanel'

const HtmlWrap = styled.div<{ dimensions: [number, number, number, number]; visible: boolean }>`
  ${({ dimensions: [top, left, width, height] = defaultDimensions }) =>
    css`
      top: ${top}px;
      left: ${left}px;
      width: ${width}px;
      height: ${height}px;
    `}
  ${({ visible }) =>
    css`
      opacity: ${visible ? 1 : 0};
      pointer-events: ${visible ? 'auto' : 'none'};
      user-select: ${visible ? 'auto' : 'none'};
    `}
  position: absolute;
  border-radius: 20px;
  font-size: 80px;
  color: #fff;
  border: solid 3px #5078f2;
  background: #00000099;
  transition: opacity 0.2s;
  overflow-y: auto;
`
