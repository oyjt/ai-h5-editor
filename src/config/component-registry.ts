import type { ComponentRegistry, ComponentCategory } from '@/types/component'
import { componentRegistry as baseComponentRegistry } from './components'
import { marketingComponentRegistry } from './marketing-components'

export const componentRegistry: ComponentRegistry = {
  ...baseComponentRegistry,
  ...marketingComponentRegistry,
}

export function getComponentConfig(type: string) {
  return componentRegistry[type]
}

export function getComponentsByCategory(category: ComponentCategory) {
  return Object.values(componentRegistry).filter(component => component.category === category)
}

export function getAllComponents() {
  return Object.values(componentRegistry)
}
