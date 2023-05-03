import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css'
import * as sphinx from 'sphinx-bridge-kevkevinpal'
import styled from 'styled-components'
import { AddNodeModal } from '~/components/AddNodeModal'
import { BudgetExplanationModal } from '~/components/BudgetExplanationModal'
import { DataRetriever } from '~/components/DataRetriever'
import { GlobalStyle } from '~/components/GlobalStyle'
import { Universe } from '~/components/Universe'
import { Flex } from '~/components/common/Flex'
import { isE2E } from '~/constants'
import { useAppStore } from '~/stores/useAppStore'
import { useDataStore, useSelectedNode } from '~/stores/useDataStore'
import { useModal } from '~/stores/useModalStore'
import { colors } from '~/utils/colors'
import { E2ETests } from '~/utils/tests'
import version from '~/utils/versionHelper'
import { Preloader } from '../Universe/Preloader'
import { AppBar } from './AppBar'
import { FooterMenu } from './FooterMenu'
import { SecondarySideBar } from './SecondarySidebar'
import { SideBar } from './SideBar'
import { Toasts } from './Toasts'

const Wrapper = styled(Flex)`
  height: 100%;
  width: 100%;
  background-color: ${colors.black};
`

const Version = styled(Flex)`
  position: absolute;
  bottom: 8px;
  left: 8px;
  color: ${colors.white};
  font-size: 12px;
  opacity: 0.5;
`

export const App = () => {
  const [isAuthorized, setAuthorized] = useState(false)

  const { open } = useModal('budgetExplanation')

  const selectedNode = useSelectedNode()
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen)

  const [searchTerm, setCurrentSearch, setRelevanceSelected, setTranscriptOpen] = useAppStore((s) => [
    s.currentSearch,
    s.setCurrentSearch,
    s.setRelevanceSelected,
    s.setTranscriptOpen,
  ])

  const hasBudgetExplanationModalBeSeen = useAppStore((s) => s.hasBudgetExplanationModalBeSeen)

  const fetchData = useDataStore((s) => s.fetchData)
  const setSphinxModalOpen = useDataStore((s) => s.setSphinxModalOpen)
  const setSelectedNode = useDataStore((s) => s.setSelectedNode)
  const setCategoryFilter = useDataStore((s) => s.setCategoryFilter)

  const form = useForm<{ search: string }>({ mode: 'onChange' })

  const handleSubmit = form.handleSubmit(({ search }) => {
    setTranscriptOpen(false)
    setSelectedNode(null)
    setRelevanceSelected(false)
    setCurrentSearch(search)
    setCategoryFilter(null)
  })

  const showSideBar = !!selectedNode || isAuthorized

  useEffect(() => {
    setSidebarOpen(showSideBar)
  }, [isAuthorized, selectedNode, setSidebarOpen, showSideBar])

  const runSearch = useCallback(async () => {
    if (searchTerm) {
      setSphinxModalOpen(true)

      // skipping this for end to end test because it requires a sphinx-relay to be connected
      if (!isE2E) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await sphinx.enable()
      }

      setSphinxModalOpen(false)

      setAuthorized(true)
    }

    fetchData(searchTerm)
  }, [fetchData, searchTerm, setSphinxModalOpen])

  useEffect(() => {
    if (searchTerm) {
      if (!hasBudgetExplanationModalBeSeen) {
        open()

        return
      }
    }

    runSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, runSearch, hasBudgetExplanationModalBeSeen])

  return (
    <>
      <GlobalStyle />

      <Wrapper direction="row">
        <DataRetriever loader={<Preloader />}>
          <FormProvider {...form}>
            <SideBar onSubmit={handleSubmit} />

            <Universe />

            <SecondarySideBar />

            <AppBar onSubmit={handleSubmit} />

            <FooterMenu />
            <Version>v{version}</Version>
          </FormProvider>
        </DataRetriever>

        <AddNodeModal />

        <Toasts />

        <BudgetExplanationModal />
      </Wrapper>
      <E2ETests />
    </>
  )
}
