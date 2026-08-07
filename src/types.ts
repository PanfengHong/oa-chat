import type { RouteObject } from 'react-router-dom'

export interface OaModuleMenuItem {
  key: string
  label: string
  path: string
}

export interface OaModuleDefinition {
  id: string
  name: string
  basePath: string
  routes: RouteObject[]
  menu: OaModuleMenuItem[]
}