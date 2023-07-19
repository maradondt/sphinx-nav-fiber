import { Table as MaterialTable, TableCell, TableHead, TableRow } from '@mui/material'
import React, { useState } from 'react'
import { MdCancel, MdCheckCircle } from 'react-icons/md'
import { ClipLoader } from 'react-spinners'
import * as sphinx from 'sphinx-bridge-kevkevinpal'
import styled from 'styled-components'
import ConfirmPopover from '~/components/common/ConfirmPopover'
import { Flex } from '~/components/common/Flex'
import { Text } from '~/components/common/Text'
import { approveRadarData, deleteRadarData } from '~/network/fetchSourcesData'
import { useDataStore } from '~/stores/useDataStore'
import { Sources } from '~/types'
import { colors } from '~/utils/colors'
import { sourcesMapper, TWITTER_LINK } from '../../constants'
import { Props } from '../../types'

const Table: React.FC<Props> = ({ data }) => {
  const setSources = useDataStore((s) => s.setQueuedSources)

  const [loadingId, setLoadingId] = useState('')

  const handleApprove = async (id: string) => {
    if (data?.length) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const enable = await sphinx.enable()

        await approveRadarData(id, enable.pubkey)

        setSources(data.filter((i) => i.id !== id))
      } catch (error) {
        console.warn(error)
      }
    }
  }

  const handleRemove = async (id: string) => {
    if (!id || !data?.length) {
      return
    }

    setLoadingId(id)

    try {
      await deleteRadarData(id)
      setSources(data?.filter((i) => i.id !== id))
    } catch (error) {
      console.warn(error)
    } finally {
      setLoadingId('')
    }
  }

  return !data?.length ? (
    <Text>There is not any results for selected filters</Text>
  ) : (
    <MaterialTable component="table">
      <TableHead component="thead">
        <TableRow component="tr">
          <StyledTableCell>Type</StyledTableCell>
          <StyledTableCell>Source</StyledTableCell>
          <StyledTableCell />
        </TableRow>
      </TableHead>
      {data?.length && (
        <tbody>
          {data?.map((i: Sources) => (
            <TableRow key={i.source} component="tr">
              <StyledTableCell>{sourcesMapper[i.source_type]}</StyledTableCell>
              <StyledTableCell width="268px">
                {i.source_type === 'twitter_handle' ? (
                  <StyledLink href={`${TWITTER_LINK}/${i.source}`} target="_blank">
                    @{i.source}
                  </StyledLink>
                ) : (
                  <div>{i.source}</div>
                )}
              </StyledTableCell>

              <StyledTableCell className="cell-center">
                <Flex direction="row" justify="space-between">
                  <div className="approve-wrapper">
                    <IconWrapper className="centered" onClick={() => handleApprove(i.id)}>
                      <MdCheckCircle color={colors.primaryGreen} />
                    </IconWrapper>
                  </div>
                  <div className="delete-wrapper">
                    {loadingId === i.id ? (
                      <ClipLoader color={colors.white} size={16} />
                    ) : (
                      <ConfirmPopover message="Are you sure ?" onConfirm={() => handleRemove(i.id)}>
                        <IconWrapper className="centered">
                          <MdCancel color={colors.primaryRed} />
                        </IconWrapper>
                      </ConfirmPopover>
                    )}
                  </div>
                </Flex>
              </StyledTableCell>
            </TableRow>
          ))}
        </tbody>
      )}
    </MaterialTable>
  )
}

export default Table

const StyledTableCell = styled(TableCell)`
  && {
    color: ${colors.white};
    border: 1px solid ${colors.white};
  }
`

const IconWrapper = styled(Flex)`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  background: transparent;
  color: ${colors.lightBlue500};
  &.centered {
    margin: 0 auto;
  }

  & + & {
    margin-left: 4px;
  }
`

const StyledLink = styled.a`
  color: ${colors.white};
  text-decoration: underline;
  &:visited {
    color: ${colors.white};
  }
`
