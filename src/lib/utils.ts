import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/*
 * tailwind-merge needs to know the Clærio type scale names. Without this,
 * it reads text-button as a text color, and drops it when another text
 * color class (text-primary-foreground) appears in the same list.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "heading-1",
        "heading-2",
        "heading-3",
        "body",
        "body-small",
        "label",
        "button",
        "monospace",
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
