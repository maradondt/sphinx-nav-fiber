import moment from 'moment'
import { useState } from 'react'
import * as sphinx from 'sphinx-bridge-kevkevinpal'
import styled from 'styled-components'
import { Flex } from '~/components/common/Flex'
import { Text } from '~/components/common/Text'
import { getSentimentData } from '~/network/fetchGraphData'

import { Stack } from '@mui/material'
import { PropagateLoader } from 'react-spinners'
import { Button } from '~/components/Button'
import { colors } from '~/utils/colors'
import { executeIfProd } from '~/utils/tests'
import { SentimentChart } from './SentimentChart'

type SentimentData = {
  date: string
  score: number
}

export const Sentiment = () => {
  const [sentimentData, setSentimentData] = useState<SentimentData[] | undefined>(undefined)

  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)

    // Wrap for tests
    await executeIfProd(() =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sphinx.enable(),
    )

    getSentimentData()
      .then((r) => {
        setSentimentData(
          r?.data
            .filter((i) => i.date)
            .map((i) => ({
              date: moment.unix(Number(String(i.date).split('.')[0])).format('MM/DD/YY'),
              score: i.sentiment_score,
            })),
        )
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <ChartWrapper align="flex-start" direction="column" id="cy-sentiment-chart-wrapper" justify="flex-end">
      <Text className="title">Sentiment chart</Text>
      {isLoading && (
        <Stack alignItems="center" flexGrow={1} p={4} spacing={2} width="100%">
          <PropagateLoader color={colors.white} />
        </Stack>
      )}
      {!sentimentData?.length && (
        <StyledButton className="button" id="cy-get-sentiments-btn" onClick={fetchData}>
          Get top 100 sentiments
        </StyledButton>
      )}
      <SentimentChart data={sentimentData} />
    </ChartWrapper>
  )
}

const ChartWrapper = styled(Flex)`
  border-radius: 8px;
  background: ${colors.dashboardHeader};
  box-shadow: 0px 5px 6px rgb(0 0 0 / 50%);
  padding: 16px;

  .title {
    margin-bottom: 16px;
    font-size: 20px;
  }
`

const StyledButton = styled(Button)`
  height: 48px;
`
