import { useColorMode, IconButton, Box } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export const ChangeColorMode = props => {
  const { toggleColorMode, colorMode } = useColorMode()
  return <Box>
    <IconButton
      onClick={toggleColorMode} 
      variant="ghost"
      aria-label='Search database' 
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} 
      {...props}
    />
  </Box>
}