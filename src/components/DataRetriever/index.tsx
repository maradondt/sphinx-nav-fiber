import invariant from 'invariant'
import { PropsWithChildren, ReactNode, useCallback, useEffect, useState } from 'react'
import { Vector3 } from 'three'
import { useDataStore, useSelectedNode } from '~/stores/useDataStore'
import { NodeExtended } from '~/types'
import { PATHWAY_RANGE } from './constants'

type Props = PropsWithChildren<{
  loader?: ReactNode
}>

export const DataRetriever = ({ children, loader }: Props) => {
  const [data, fetchData] = [useDataStore((s) => s.data), useDataStore((s) => s.fetchData)]
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])

  if (data === null && loader) {
    return <>{loader}</>
  }

  if (data === null) {
    return null
  }

  return <>{loading ? loader : children}</>
}

export const useGraphData = () => {
  const data = useDataStore((s) => s.data)

  invariant(data !== null, 'This hook is meant to be used inside a DataRetriever component')

  return data
}

type BadgeProps = {
  value: number
  position: Vector3
  userData: NodeExtended
}

export const usePathway = () => {
  const selectedNode = useSelectedNode()

  return useDataStore(
    useCallback(
      (s) => {
        const nodes = s.data!.nodes || []
        const selectedNodeIndex = selectedNode ? nodes.findIndex((f) => f.ref_id === selectedNode?.ref_id) : 0

        const fromIndex = selectedNodeIndex - PATHWAY_RANGE > 0 ? selectedNodeIndex - PATHWAY_RANGE : 0

        const toIndex =
          selectedNodeIndex + PATHWAY_RANGE > nodes.length - 1 ? nodes.length - 1 : selectedNodeIndex + PATHWAY_RANGE

        const pathway = nodes.slice(fromIndex, toIndex)

        const badges: BadgeProps[] = []

        pathway.forEach((n) => {
          const nodeIndex = nodes.findIndex((f) => f.ref_id === n.ref_id)

          const badge = {
            value: nodeIndex + 1,
            position: new Vector3(n.x || 0, n.y || 0, n.z || 0),
            userData: n,
          }

          badges.push(badge)
        })

        // always include the first result
        const includesFirstResult = badges.find((f) => f.value === 1)

        if (nodes.length && !includesFirstResult) {
          const firstNode = nodes[0]

          badges.unshift({
            value: 1,
            position: new Vector3(firstNode.x || 0, firstNode.y || 0, firstNode.z || 0),
            userData: firstNode,
          })
        }

        return {
          badges,
          pathway,
        }
      },

      [selectedNode],
    ),
  )
}
