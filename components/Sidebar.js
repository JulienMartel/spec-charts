import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Stack,
  Avatar,
  HStack,
  Heading,
  Tag,
  Link,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { SearchBar } from './SearchBar';
import { ChangeColorMode } from './ChangeColorMode'
import featured from './../featured.json'
import { useAppContext } from './../context/state'

export const Sidebar = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }}>
        {children}
      </Box>
    </Box>
  );
}


const SidebarContent = ({ onClose, ...rest }) => {
  const { setCollection } = useAppContext()

  const borderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200")
  const bg = useColorModeValue('white', '#020202')
  const subtext = useColorModeValue("blackAlpha.500", "whiteAlpha.500")
  const hoverBg = useColorModeValue("blackAlpha.50", "whiteAlpha.50")

  return (
    <Box
      bg={bg}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Logo />

        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      <Stack m="2" p="2" rounded="lg" border="1px solid" borderColor={borderColor}>
        <SearchBar {...{onClose}} />
        
        <Text color={subtext}>watchlist</Text>

        <Text p="5" textAlign="center">must be premium to use watchlist💜</Text>
      </Stack>

      <Stack m="2" p="2" rounded="lg" border="1px solid" borderColor={borderColor}>
        <Text color={subtext}>featured</Text>

        {featured.map(c => 
          <HStack 
            key={c.collectionId}
            p="2"
            rounded="lg"
            cursor="pointer"
            onClick={() => setCollection(c)}
            _hover={{
              bg: hoverBg
            }}
          >
            <Avatar size="xs" src={c.image} />
            <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{c.name}</Text>
          </HStack>
        )}

      </Stack>

      <Stack m="2" p="2" rounded="lg" border="1px solid" borderColor={borderColor}>
        <ChangeColorMode />
      </Stack>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      borderBottomWidth="1px"
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      {/* <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text> */}
    </Flex>
  );
};

const Logo = () => {
  return <Flex align="flex-end" h="min" >
    <Link href="https://spec.science" _hover={{textDecoration: "none"}} >
      <Heading size="xl" mr={3} >
        ◌ spec
      </Heading>
    </Link>

    <Tag size="sm" colorScheme='green'>charts</Tag>
  </Flex>
}