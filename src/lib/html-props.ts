import type * as React from "react"

/*
 * Documented pass-through props.
 *
 * Most components spread their other props onto a native element or a
 * Radix primitive. Storybook's prop extractor (react-docgen) skips types
 * that come from React or Radix, so those props were missing from the docs
 * an agent reads through the Storybook MCP docs-show tool.
 *
 * Each type below re-declares those props with the same types React uses,
 * plus a short description. Adding one to a component's props changes
 * nothing at runtime or in type checking: it only makes the props visible
 * in the docs. Radix-specific props are declared in each component file.
 *
 * In the docs, E stands for the DOM element the component renders, such as
 * HTMLButtonElement.
 *
 * Attributes not listed here, such as data-* and other aria-* attributes,
 * still pass through to the same element.
 */

/** The className prop. */
export type ClassNameProps = {
  /** Extra classes, merged after the component's own classes. */
  className?: string
}

/** The id prop. */
export type IdProps = {
  /** Element id. */
  id?: string
}

/** Global attributes whose types don't depend on the element. */
export type AttributeProps = {
  /** Inline styles. Prefer tokens and classes. */
  style?: React.CSSProperties
  /** Native title attribute. Don't use it for essential information. */
  title?: string
  /** ARIA role. Only set it when the default role is wrong. */
  role?: React.AriaRole
  /** Tab order. Use 0 or -1 only. */
  tabIndex?: number
  /** Hides the element. */
  hidden?: boolean
  /** Accessible name, when there is no visible label. */
  "aria-label"?: string
  /** Id of the element that names this one. */
  "aria-labelledby"?: string
  /** Id of the element that describes this one. */
  "aria-describedby"?: string
  /** Hides the element from screen readers. */
  "aria-hidden"?: boolean | "true" | "false"
}

/** The ref prop. E is the rendered DOM element. */
export type RefProps<E extends Element = HTMLElement> = {
  /** Ref to the rendered DOM element (E). */
  ref?: React.Ref<E>
}

/** The onClick prop. E is the rendered DOM element. */
export type ClickProps<E extends Element = HTMLElement> = {
  /** Called on click. */
  onClick?: React.MouseEventHandler<E>
}

/** Keyboard and focus handlers. E is the rendered DOM element. */
export type KeyFocusProps<E extends Element = HTMLElement> = {
  /** Called on key down. */
  onKeyDown?: React.KeyboardEventHandler<E>
  /** Called when the element gets focus. */
  onFocus?: React.FocusEventHandler<E>
  /** Called when the element loses focus. */
  onBlur?: React.FocusEventHandler<E>
}

/** The ref and the most used event handlers. */
export type EventProps<E extends Element = HTMLElement> = RefProps<E> & ClickProps<E> & KeyFocusProps<E>

/** Props every component that renders a DOM element passes to it. */
export type CommonProps<E extends Element = HTMLElement> = ClassNameProps & IdProps & AttributeProps & EventProps<E>

/** The children prop, for components that render content inside them. */
export type ChildrenProps = {
  /** Content inside the component. */
  children?: React.ReactNode
}

/** The asChild prop that every Radix part accepts. */
export type RadixAsChildProps = {
  /** Render the single child element instead, with this part's behavior and props merged onto it. */
  asChild?: boolean
}

/** Native <button> attributes. */
export type ButtonElementProps = {
  /** Dims the control and blocks clicks. */
  disabled?: boolean
  /** The native button type. Components that render a <button> default to "button" unless they say otherwise. */
  type?: "submit" | "reset" | "button"
  /** Form field name, sent with the form when the button submits it. */
  name?: string
  /** Form field value, sent with the form when the button submits it. */
  value?: string | readonly string[] | number
  /** Id of the form the button belongs to, when it sits outside that form. */
  form?: string
  /** Focuses the button on page load. Use sparingly. */
  autoFocus?: boolean
}

/** Native <input> attributes. */
export type InputElementProps = {
  /** The input type. Defaults to "text". */
  type?: React.HTMLInputTypeAttribute
  /** The value, when you control the input. Use with onChange. */
  value?: string | readonly string[] | number
  /** The value at first, when you don't control the input. */
  defaultValue?: string | readonly string[] | number
  /** Example text shown while empty. Never use it instead of a label. */
  placeholder?: string
  /** Dims the input and blocks typing. */
  disabled?: boolean
  /** Shows the value but blocks typing. */
  readOnly?: boolean
  /** Marks the input as required for form submission. */
  required?: boolean
  /** Form field name. */
  name?: string
  /** Browser autofill hint, such as "email" or "postal-code". */
  autoComplete?: React.HTMLInputAutoCompleteAttribute
  /** Focuses the input on page load. Use sparingly. */
  autoFocus?: boolean
  /** The on-screen keyboard to show, such as "numeric" or "email". */
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search"
  /** Longest allowed value, in characters. */
  maxLength?: number
  /** Shortest allowed value, in characters. */
  minLength?: number
  /** Regular expression the value must match. */
  pattern?: string
  /** Smallest allowed value, for number and date types. */
  min?: number | string
  /** Largest allowed value, for number and date types. */
  max?: number | string
  /** Step between allowed values, for number and date types. */
  step?: number | string
  /** Id of the form the input belongs to, when it sits outside that form. */
  form?: string
  /** Called on every change to the value. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

/** Native <a> attributes. */
export type AnchorElementProps = {
  /** Where the link goes. */
  href?: string
  /** Where to open the link, such as "_blank". */
  target?: React.HTMLAttributeAnchorTarget
  /** Link relationship, such as "noopener noreferrer" with target="_blank". */
  rel?: string
  /** Downloads the linked file instead of opening it. A string sets the file name. */
  download?: boolean | string
}

/** Native <th> and <td> attributes. */
export type TableCellElementProps = {
  /** Number of columns the cell spans. */
  colSpan?: number
  /** Number of rows the cell spans. */
  rowSpan?: number
}

/** Radix props for layers that close on Escape or an outside click. */
export type RadixDismissProps = {
  /** Called when the person presses Escape. Call event.preventDefault() to keep it open. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  /** Called on a pointer down outside. Call event.preventDefault() to keep it open. */
  onPointerDownOutside?: (event: CustomEvent<{ originalEvent: PointerEvent }>) => void
}

/** Radix positioning props for menus and tooltips placed next to a trigger. */
export type RadixPopperProps = {
  /** The side of the trigger to open on. Flips when there isn't room. */
  side?: "top" | "right" | "bottom" | "left"
  /** Alignment against the trigger. */
  align?: "start" | "center" | "end"
  /** Pixels to shift from the align position. */
  alignOffset?: number
  /** Moves the layer to stay on screen. Defaults to true. */
  avoidCollisions?: boolean
  /** Pixels to keep between the layer and the screen edges. */
  collisionPadding?: number | Partial<Record<"top" | "right" | "bottom" | "left", number>>
  /** "partial" (the default) or "always": how the layer sticks to the trigger while scrolling. */
  sticky?: "partial" | "always"
  /** Hides the layer when the trigger scrolls out of view. */
  hideWhenDetached?: boolean
}
