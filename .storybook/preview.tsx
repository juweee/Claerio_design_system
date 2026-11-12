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
      // Show accessibility failures in the panel without failing the build.
      test: "todo",
    },
    options: {
      storySort: { order: ["Foundations", ["Color", "Type", "Spacing, radius and shadows"], "Components"] },
    },
  },
}

export default preview
