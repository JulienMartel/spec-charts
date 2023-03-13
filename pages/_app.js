import '../styles/globals.css'
import { ChakraProvider, extendTheme, useColorModeValue } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { AppWrapper } from '../context/state'

const theme = extendTheme({
  styles: {
    global: props => ({
      body: {
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('white', '#020202')(props),
      },
    
    }),
  },
})

function MyApp({ Component, pageProps }) {
  return <ChakraProvider theme={theme}>
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  </ChakraProvider>
}

export default MyApp
