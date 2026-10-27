// primitives/tabs/tabs.tsx
import { useId, useMemo, useRef, type ComponentPropsWithRef, type KeyboardEvent } from 'react'
import { createStrictContext } from '../../core/context'
import { composeEventHandlers } from '../../core/compose'
import { useControllableState } from '../../hooks/useControllableState'

interface TabsCtx {
  baseId: string
  value: string
  setValue: (v: string) => void
  orientation: 'horizontal' | 'vertical'
}
const [TabsContext, useTabs] = createStrictContext<TabsCtx>('Tabs', 'Tabs.Root')

interface RootProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  value?: string
  defaultValue?: string
  onValueChange?: (v: string) => void
  orientation?: 'horizontal' | 'vertical'
}

function Root({ value, defaultValue = '', onValueChange, orientation = 'horizontal', ...rest }: RootProps) {
  const baseId = useId()
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange })
  const ctx = useMemo(() => ({ baseId, value: current, setValue: setCurrent, orientation }), [baseId, current, setCurrent, orientation])
  return (
    <TabsContext value={ctx}>
      <div {...rest} data-orientation={orientation} />
    </TabsContext>
  )
}

function List(props: ComponentPropsWithRef<'div'>) {
  const { orientation } = useTabs()
  return <div role="tablist" aria-orientation={orientation} {...props} />
}

function Trigger({ value, disabled, onKeyDown, onClick, ...rest }: ComponentPropsWithRef<'button'> & { value: string }) {
  const ctx = useTabs()
  const selected = ctx.value === value
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const horizontal = ctx.orientation === 'horizontal'
    const next = { [horizontal ? 'ArrowRight' : 'ArrowDown']: 1, [horizontal ? 'ArrowLeft' : 'ArrowUp']: -1 }[e.key]
    const list = e.currentTarget.closest('[role="tablist"]')!
    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'))
    const i = tabs.indexOf(e.currentTarget)
    let target: HTMLButtonElement | undefined
    if (next) target = tabs[(i + next + tabs.length) % tabs.length]
    else if (e.key === 'Home') target = tabs[0]
    else if (e.key === 'End') target = tabs.at(-1)
    if (target) { e.preventDefault(); target.focus(); target.click() } // automatic activation
  }
  return (
    <button
      {...rest}
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      data-state={selected ? 'active' : 'inactive'}
      disabled={disabled}
      onClick={composeEventHandlers(onClick, () => ctx.setValue(value))}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
    />
  )
}

function Panel({ value, forceMount, ...rest }: ComponentPropsWithRef<'div'> & { value: string; forceMount?: boolean }) {
  const ctx = useTabs()
  const active = ctx.value === value
  if (!active && !forceMount) return null
  return (
    <div
      {...rest}
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      hidden={!active}
      tabIndex={0}
    />
  )
}

export const Tabs = { Root, List, Trigger, Panel }
