import { Segments } from '@react-three/drei'
import { useGraphData } from '~/components/DataRetriever'
import { useDataStore } from '~/stores/useDataStore'
import { GraphData } from '~/types'
import { Cubes } from './Cubes'
import { GraphLoadingIcon } from './Icons'
import { PathwayLine } from './PathwayLine'
import { Segment } from './Segment'
import { NodeDetailsPanel } from './UI'

export const Graph = () => {
  const data = useGraphData()
  const isLoading = useDataStore((s) => s.isFetching)
  const graphStyle = useDataStore((s) => s.graphStyle)

  if (isLoading) {
    return <GraphLoadingIcon />
  }

  return (
    <>
      <Cubes />
      <NodeDetailsPanel />

      <PathwayLine />

      <Segments
        /** NOTE: using the key in this way the segments re-mounts
         *  everytime the data.links count changes
         * */
        key={`links-${data.links.length}-${graphStyle}`}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fog
        limit={data.links.length}
        lineWidth={0.15}
      >
        {(data.links as unknown as GraphData['links']).map((link, index) => (
          <Segment
            // eslint-disable-next-line react/no-array-index-key
            key={index.toString()}
            link={link}
          />
        ))}
      </Segments>
    </>
  )
}

Segments.displayName = 'Segments'
