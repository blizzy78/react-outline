'use client'

import clsx from 'clsx'
import React from 'react'
import { Section, useSections } from './sections'

export const Outline = ({ rootElement }: { rootElement?: Element }) => {
  const sections = useSections(rootElement)

  return (
    <div className="flex flex-col gap-3 bg-white text-gray-800 dark:bg-slate-700 dark:text-gray-200" data-outline>
      <h1 className="text-xl font-semibold text-gray-600 dark:text-slate-300">Document Outline</h1>

      <SectionTable sections={sections} />
    </div>
  )
}

const SectionTable = ({ sections }: { sections: readonly Section[] }) => (
  <div className="grid grid-cols-[max-content_max-content_1fr_1fr]">
    <TableHeading>Element</TableHeading>
    <TableHeading className="pl-8">Heading</TableHeading>
    <TableHeading className="pl-8">Label</TableHeading>
    <TableHeading className="pl-8">ARIA Label</TableHeading>

    <SectionList sections={sections} level={0} />
  </div>
)

const TableHeading = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <div className={clsx('border-b border-gray-200 py-0.5 dark:border-slate-500', className)}>
    <div className="font-semibold text-gray-500 dark:text-slate-400">{children}</div>
  </div>
)

const SectionList = ({ sections, level }: { sections: readonly Section[]; level: number }) => (
  <>
    {sections.map((section, idx) => (
      <React.Fragment key={idx}>
        <SectionListEntry section={section} level={level} />

        <SectionList sections={section.children} level={level + 1} />
      </React.Fragment>
    ))}
  </>
)

const SectionListEntry = ({ section, level }: { section: Section; level: number }) => {
  return (
    <>
      <div className={clsx('flex flex-row items-center', section.inMain && 'bg-gray-100 dark:bg-slate-900/30')}>
        <div className="px-1.5 py-0.5">
          <IndentedDiv level={level}>
            <div
              className={clsx(
                'inline-block rounded bg-gray-200 px-2 py-1 font-mono text-sm leading-none text-black dark:bg-slate-500 dark:text-white',
                section.implicit && 'italic',
              )}
            >
              {section.elementTag}
            </div>
          </IndentedDiv>
        </div>
      </div>

      <div className={clsx('flex flex-row items-center', section.inMain && 'bg-gray-100 dark:bg-slate-900/30')}>
        <div className="px-1.5 py-0.5 pl-8">
          {!!section.labelElementTag ? (
            <IndentedDiv level={level}>
              <div className="inline-block rounded bg-gray-200 px-2 py-1 font-mono text-sm leading-none text-black dark:bg-slate-500 dark:text-white">
                {section.labelElementTag}
              </div>
            </IndentedDiv>
          ) : (
            <>&nbsp;</>
          )}
        </div>
      </div>

      <div className={clsx('flex flex-row items-center', section.inMain && 'bg-gray-100 dark:bg-slate-900/30')}>
        <div className="px-1.5 py-0.5 pl-8">
          {!!section.label ? (
            <IndentedDiv className="line-clamp-1" level={level}>
              {section.label}
            </IndentedDiv>
          ) : (
            <>&nbsp;</>
          )}
        </div>
      </div>

      <div className={clsx('flex flex-row items-center', section.inMain && 'bg-gray-100 dark:bg-slate-900/30')}>
        <div className="px-1.5 py-0.5 pl-8">
          {!!section.ariaLabel || !!section.label ? (
            <IndentedDiv
              level={level}
              className={clsx('line-clamp-1', section.ariaLandmark && 'font-semibold underline')}
            >
              {section.ariaLabel ?? section.label}
            </IndentedDiv>
          ) : (
            <>&nbsp;</>
          )}
        </div>
      </div>
    </>
  )
}

const IndentedDiv = ({
  level,
  className,
  children,
}: {
  level: number
  className?: string
  children?: React.ReactNode
}) => {
  const paddings = [
    undefined,
    'pl-[1.25rem]',
    'pl-[2.5rem]',
    'pl-[3.75rem]',
    'pl-[5rem]',
    'pl-[6.25rem]',
    'pl-[7.5rem]',
    'pl-[8.75rem]',
    'pl-[10rem]',
    'pl-[11.25rem]',
    'pl-[12.5rem]',
    'pl-[13.75rem]',
    'pl-[15rem]',
    'pl-[16.25rem]',
    'pl-[17.5rem]',
    'pl-[18.75rem]',
  ] as const

  return <div className={clsx(paddings[level], className)}>{children}</div>
}
