import { ThemeProvider, createTheme } from '@mui/material'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { FC, PropsWithChildren } from 'react'
import { ThemeProvider as StyleThemeProvider } from 'styled-components'
import { colors } from '~/utils/colors'
import { breakpoints } from '~/utils/media'

export const appTheme = createTheme({
  palette: {
    primary: {
      main: colors.primaryButton,
    },
    mode: 'dark',
  },
  breakpoints: {
    values: {
      xs: breakpoints.small,
      sm: breakpoints.medium,
      md: breakpoints.large,
      lg: 1200,
      xl: 1500,
    },
  },
})

export const AppProviders: FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider theme={appTheme}>
    <StyleThemeProvider theme={appTheme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>{children}</LocalizationProvider>
    </StyleThemeProvider>
  </ThemeProvider>
)
