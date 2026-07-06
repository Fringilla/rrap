'use client'

import { ClientOnly, IconButton, Skeleton, Span } from '@chakra-ui/react'
import { ThemeProvider, useTheme } from 'next-themes'

import * as React from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'

const STORAGE_KEY = 'rrap-theme'
const COOKIE_KEY = 'rrap-theme'

function readStoredTheme() {
  if (typeof window === 'undefined') return 'system'

  const storedTheme = window.localStorage.getItem(STORAGE_KEY)
  if (storedTheme) return storedTheme

  const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]*)`))
  if (cookieMatch) return decodeURIComponent(cookieMatch[1])

  return 'system'
}

function persistTheme(theme) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(STORAGE_KEY, theme)
  document.cookie = `${COOKIE_KEY}=${theme}; path=/; max-age=31536000; SameSite=Lax`
}

export function ColorModeProvider(props) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
      storageKey={STORAGE_KEY}
      {...props}
    />
  )
}

export function useColorMode() {
  const { theme, resolvedTheme, setTheme, forcedTheme } = useTheme()
  const colorMode = forcedTheme || resolvedTheme
  const selectedTheme = theme || 'system'

  React.useEffect(() => {
    const storedTheme = readStoredTheme()
    if (storedTheme && storedTheme !== selectedTheme) {
      setTheme(storedTheme)
    }
  }, [selectedTheme, setTheme])

  const setColorMode = (value) => {
    const nextTheme = value || 'system'
    setTheme(nextTheme)
    persistTheme(nextTheme)
  }

  const toggleColorMode = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setColorMode(nextTheme)
  }

  return {
    colorMode,
    selectedTheme,
    setColorMode,
    toggleColorMode,
  }
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? <LuMoon /> : <LuSun />
}

export const ColorModeButton = React.forwardRef(
  function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode()
    return (
      <ClientOnly fallback={<Skeleton boxSize='8' />}>
        <IconButton
          onClick={toggleColorMode}
          variant='ghost'
          aria-label='Toggle color mode'
          size='sm'
          ref={ref}
          {...props}
          css={{
            _icon: {
              width: '5',
              height: '5',
            },
          }}
        >
          <ColorModeIcon />
        </IconButton>
      </ClientOnly>
    )
  },
)

export const LightMode = React.forwardRef(function LightMode(props, ref) {
  return (
    <Span
      color='fg'
      display='contents'
      className='chakra-theme light'
      colorPalette='gray'
      colorScheme='light'
      ref={ref}
      {...props}
    />
  )
})

export const DarkMode = React.forwardRef(function DarkMode(props, ref) {
  return (
    <Span
      color='fg'
      display='contents'
      className='chakra-theme dark'
      colorPalette='gray'
      colorScheme='dark'
      ref={ref}
      {...props}
    />
  )
})
