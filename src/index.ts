import {
  createContextId,
  useContext,
  useContextProvider,
} from "@builder.io/qwik"
import type { Cookie } from "@builder.io/qwik-city"

const FLASH_MESSAGE = "flash-message"
const flash = (name: string) => `__${name}__`

export const readFlash = (cookie: Cookie, name: string) => {
  const flashedName = flash(name)
  let flashValue

  if (cookie.has(flashedName)) {
    flashValue = cookie.get(flashedName)
    cookie.delete(flashedName, { path: "/" })
  }

  return flashValue
}

export const writeFlash = (cookie: Cookie, name: string, value: any) => {
  cookie.set(flash(name), value, { path: "/", httpOnly: true })
}

export type MessageVariant = "info" | "success" | "error"

export const readFlashMessage = (cookie: Cookie) =>
  readFlash(cookie, FLASH_MESSAGE)?.json() as
    | {
        value: string
        type: MessageVariant
      }
    | undefined

export const flashMessage = (
  cookie: Cookie,
  value: string,
  type?: MessageVariant,
) => {
  writeFlash(cookie, FLASH_MESSAGE, { value, type })
}

export type FlashContextStore = {
  value?: string
  type?: MessageVariant
}
export const FlashContext = createContextId<FlashContextStore>("FLASH_PROVIDER")

export const useFlashProvider = (store: FlashContextStore) =>
  useContextProvider(FlashContext, store)

export const useFlashContext = () => useContext(FlashContext)
