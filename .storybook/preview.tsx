import type { Preview } from "@storybook/react-vite"
import { withThemeByClassName } from "@storybook/addon-themes"

import "../src/styles/globals.css"

const preview: Preview = {
  decorators: [
    // Toolbar switch: adds or removes the .dark class on <html>.
    withThemeByClassName({
      themes: { Light: "", Dark: "dark" },
      defaultTheme: "Light",
    }),
  ],
  parameters: {
    layout: "padded",
    backgrounds: { disabled: true },
    controls: { expanded: true },
    a11y: {
      // Accessibility violations fail the story's test (decided 2026-11-13).
      // Exempt a rule only on a specific story, with a comment saying why.
      test: "error",
    },
    options: {
      storySort: { order: ["Foundations", ["Color", "Type", "Spacing, radius and shadows"], "Components"] },
    },
  },
}

export default preview
