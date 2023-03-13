import { 
  Input,
  Box,
  Text,
  Flex,
  Avatar,
  useColorModeValue,
  useOutsideClick,
  Spinner,
  InputGroup,
  InputRightElement,
  Kbd,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/state'

export const SearchBar = ({onClose}) => {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [debounceTimeout, setDebounceTimeout] = useState(null)
  useEffect(() => {
    if (search.length >= 3) {
      clearTimeout(debounceTimeout) // debounce the search
      setDebounceTimeout(setTimeout(() => {
        getResults(search)
      }, 500))
    }
  }, [search])

  const getResults = async search => {
    setLoading(true)
    const response = await fetch(`https://api.reservoir.tools/search/collections/v1?name=${search}&limit=10`)
    const {collections} = await response.json()
    setResults(collections)
    console.log(collections)
    setLoading(false)
  }

  // for when they click "/" hotkey
  const inputRef = useRef()
  const onKeyDown = e => {
    if (e.key === "/" && document.activeElement !== inputRef.current) {
      e.preventDefault()
      inputRef.current.focus()
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return <Box position="relative" w="full">
    <InputGroup>
      <InputRightElement pointerEvents='none'>
        <Kbd>/</Kbd>
      </InputRightElement>
      <Input
        ref={inputRef}
        variant="filled" 
        placeholder='search...'  
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </InputGroup>
    {search.length > 0 && <SearchResults {...{search, results, loading, setSearch, setResults, onClose}} />}
  </Box>
}

const SearchResults = ({search, results, loading, setSearch, setResults, onClose}) => {
  const ref = useRef()
  const [showResults, setShowResults] = useState(true)

  const { setCollection } = useAppContext()

  const shadowStyle = useColorModeValue("lg", "dark-lg")
  const bg = useColorModeValue("white", "#020202")
  const hoverBg = useColorModeValue("blackAlpha.50", "whiteAlpha.50")
  const borderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.300")

  useEffect(() => {
    setShowResults(true)
  }, [search])

  useOutsideClick({
    ref: ref,
    handler: () => setShowResults(false),
  })

  if (!showResults) return null
  
  return <Box 
    ref={ref} 
    w="full" 
    pos="absolute" 
    zIndex="99" 
    bg={bg}
    shadow={shadowStyle}
  >
    { loading ?
      <Flex justify="center" w="full">
        <Spinner size="lg" my="16" /> 
      </Flex>
      : 
       (
        results.length === 0 && search.length >= 3 ? 
          <Text p="4">No results found</Text>
          :
          <Box>
            {results.map(c =>
              <Flex 
                key={c.collectionId}
                align="center"
                justify={"space-between"}
                _hover={{cursor: "pointer", bg: hoverBg}}
                transition="background-color 0.2s"
                p={3}
                border="2px solid"
                borderBottom="none"
                borderColor={borderColor}
                _last={{borderBottomStyle: "solid", borderBottomWidth: "2px"}}
                onClick={() => {
                  setCollection(c)
                  setSearch("")
                  setResults([])
                  onClose()
                }}
              >
                <Flex align="center">
                  <Avatar size="xs" src={c.image} mr="4" />
                  <Text fontSize="sm">{c.name}</Text>
                </Flex>
              </Flex>
            )
            }
          </Box>
       )
    }
  </Box>
}