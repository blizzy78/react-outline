// @vitest-environment jsdom

import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SimpleMutationRecord, mutationCallback, useOnMutation } from './useOnMutation'

describe('useOnMutation', () => {
  it('calls callback on initial mount', () => {
    document.createElement('body')

    let callbackCalled = false

    const props: {
      rootElement: Element
      filter: (record: SimpleMutationRecord) => boolean
      callback: () => void
    } = {
      rootElement: document.body,
      filter: () => true,
      callback: () => (callbackCalled = true),
    }

    const { rerender } = renderHook<void, typeof props>(
      (props) => useOnMutation(props.filter, props.callback, props.rootElement),
      {
        initialProps: props,
      },
    )

    rerender(props)

    expect(callbackCalled).toBeTruthy()
  })
})

describe('mutationCallback', () => {
  it('calls filter for mutation records', () => {
    let filterCalled = false

    const mutCallback = mutationCallback(
      () => {
        filterCalled = true
        return true
      },
      () => {
        /**/
      },
    )

    mutCallback([{ type: 'childList', target: document }])

    expect(filterCalled).toBeTruthy()
  })

  it('calls callback on mutation', () => {
    let callbackCalled = false

    const mutCallback = mutationCallback(
      () => true,
      () => (callbackCalled = true),
    )

    mutCallback([{ type: 'childList', target: document }])

    expect(callbackCalled).toBeTruthy()
  })
})
