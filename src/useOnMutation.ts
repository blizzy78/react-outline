'use client'

import { useEffect } from 'react'

export interface SimpleMutationRecord {
  type: MutationRecordType
  target: Node
}

export const useOnMutation = (
  filter: (record: SimpleMutationRecord) => boolean,
  callback: () => void,
  rootElement?: Element,
) => {
  useEffect(() => {
    callback()

    const observer = new MutationObserver(mutationCallback(filter, callback))

    observer.observe(rootElement ?? document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    })

    return () => observer.disconnect()
  }, [filter, callback, rootElement])
}

export const mutationCallback =
  (filter: (record: SimpleMutationRecord) => boolean, callback: () => void) =>
  (records: readonly SimpleMutationRecord[]) => {
    if (!records.some(filter)) {
      return
    }

    callback()
  }
