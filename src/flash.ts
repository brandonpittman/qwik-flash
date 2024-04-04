import { useVisibleTask$ } from "@builder.io/qwik"
import type { Cookie, Loader } from "@builder.io/qwik-city"
import { toast } from "qwik-sonner"

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

export const useFlashMessage = (
  useLoader: Loader<{ flashMessageValue: { value: string; type: string } }>,
) => {
  const data = useLoader()

  // eslint-disable-next-line
  useVisibleTask$(({ track }) => {
    track(() => data.value.flashMessageValue?.value)

    if (data.value.flashMessageValue?.value)
      switch (data.value.flashMessageValue.type) {
        case "info":
          toast.info(data.value.flashMessageValue.value)
          break
        case "error":
          toast.error(data.value.flashMessageValue.value)
          break
        case "success":
          toast.success(data.value.flashMessageValue.value)
          break
        default:
          toast(data.value.flashMessageValue.value)
      }
  })
}
