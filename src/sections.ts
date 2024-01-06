'use client'

import { useCallback, useState } from 'react'
import { SimpleMutationRecord, useOnMutation } from './useOnMutation'

export type Section = {
  elementTag: string
  implicit?: boolean
  inMain?: boolean
  labelElementTag?: string
  label?: string
  ariaLabel?: string
  ariaLandmark?: boolean
  children: readonly Section[]
}

export const useSections = (rootElement?: Element) => {
  const [sections, setSections] = useState<readonly Section[]>([])

  const filter = useCallback(mutationOutsideOutline, [])
  const onMutate = useCallback(() => setSections(elementSection(rootElement ?? document.body).children), [rootElement])
  useOnMutation(filter, onMutate, rootElement)

  return sections
}

const mutationOutsideOutline = (record: SimpleMutationRecord) => {
  const element = record.type === 'characterData' ? record.target.parentElement : (record.target as Element)
  if (!element) {
    return false
  }

  return !insideOutline(element)
}

export const elementSection = (element: Element) => {
  const elementTag = element.tagName.toLowerCase()
  const implicit =
    elementTag !== 'article' && elementTag !== 'section' && elementTag !== 'nav' && elementTag !== 'aside'

  let label: string | undefined
  let labelElementTag: string | undefined

  const childElements = Array.from(element.children).filter((e) => !insideOutline(e))

  let children = childSections(childElements)
  createHeadingSections(children)

  if (isHeadingElement(element)) {
    // heading element is labeled by itself
    label = element.textContent ?? undefined
    labelElementTag = elementTag
  } else if (!implicit) {
    // explicit section is labeled by first child heading
    const firstHeadingSection = children.find((s) => isHeading(s.elementTag))

    if (!!firstHeadingSection) {
      label = firstHeadingSection.label
      labelElementTag = firstHeadingSection.labelElementTag

      // first child heading will not create an implicit subsection -> remove it and pull its children up
      const idx = children.indexOf(firstHeadingSection)
      children = [...children.slice(0, idx), ...firstHeadingSection.children, ...children.slice(idx + 1)]
    }
  }

  const ariaLabelAttr = element.getAttribute('aria-label')
  const ariaLabelledByAttr = element.getAttribute('aria-labelledby')
  const labelledByElement = !!ariaLabelledByAttr ? document.getElementById(ariaLabelledByAttr) ?? undefined : undefined
  const ariaLabel = ariaLabelAttr ?? labelledByElement?.textContent ?? undefined

  const section: Section = {
    elementTag: elementTag,
    implicit,
    inMain: !!element.closest('main'),
    label,
    labelElementTag,
    ariaLabel,
    ariaLandmark:
      elementTag === 'nav' ||
      elementTag === 'aside' ||
      !!element.getAttribute('aria-label') ||
      !!element.getAttribute('aria-labelledby'),
    children,
  }

  return section
}

const childSections = (childElements: readonly Element[]) => {
  let childSections: Section[] = []

  for (let childIdx = 0; childIdx < childElements.length; childIdx++) {
    const childElement = childElements[childIdx]
    const childSection = elementSection(childElement)

    switch (childSection.elementTag) {
      case 'article':
      case 'section':
      case 'nav':
      case 'aside':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        childSections.push(childSection)
        break
      }

      default: {
        childSections = [...childSections, ...childSection.children]
        break
      }
    }
  }

  return childSections
}

const createHeadingSections = (children: Section[]) => {
  for (let childIdx = 0; childIdx < children.length; childIdx++) {
    const childSection = children[childIdx]
    switch (childSection.elementTag) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        const level = parseInt(childSection.elementTag.substring(1))

        let endIdx = children.length
        for (let potEndIdx = childIdx + 1; potEndIdx < children.length; potEndIdx++) {
          const endSection = children[potEndIdx]
          if (!isHeading(endSection.elementTag)) {
            continue
          }

          const endLevel = parseInt(endSection.elementTag.substring(1))
          if (endLevel <= level) {
            endIdx = potEndIdx
            break
          }
        }

        childSection.children = [...childSection.children, ...children.slice(childIdx + 1, endIdx)]
        children.splice(childIdx + 1, endIdx - childIdx - 1)

        const grandChildren = [...childSection.children]
        createHeadingSections(grandChildren)
        childSection.children = grandChildren

        break
    }
  }
}

const isHeadingElement = (element: Element) => isHeading(element.tagName.toLowerCase())

const isHeading = (elementTag: string) =>
  elementTag === 'h1' ||
  elementTag === 'h2' ||
  elementTag === 'h3' ||
  elementTag === 'h4' ||
  elementTag === 'h5' ||
  elementTag === 'h6'

const insideOutline = (element: Element) => !!element.closest('[data-outline]')
