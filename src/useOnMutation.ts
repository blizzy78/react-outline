import { useEffect } from 'react'

export interface SimpleMutationRecord {
  type: MutationRecordType
  target: Node
}

export const useOnMutation = (
  rootElement: Element,
  filter: (record: SimpleMutationRecord) => boolean,
  callback: () => void
) => {
  useEffect(() => {
    callback()

    const observer = new MutationObserver(mutationCallback(filter, callback))

    observer.observe(rootElement, {
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
