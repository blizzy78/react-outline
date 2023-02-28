// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { elementSection } from './sections'

describe('elementSection', () => {
  const tests: { name: string; html: string }[] = [
    { name: 'empty', html: '' },
    { name: 'explicit', html: '<main><article></article></main>' },
    { name: 'implicit', html: '<main><h1>1</h1><h2>1.1</h2><h1>2</h1></main>' },
    { name: 'non-sectioning', html: '<article><main><section></section></main></article>' },
    { name: 'heading label', html: '<section><h1>foo</h1><h2>bar</h2></section>' },
  ]

  for (const test of tests) {
    it(test.name, () => {
      const element = createElement(test.html)
      const sections = elementSection(element).children
      expect(sections).toMatchSnapshot(test.html)
    })
  }
})

const createElement = (html: string) => {
  const template = document.createElement('body')
  template.insertAdjacentHTML('beforeend', html)
  return template
}
