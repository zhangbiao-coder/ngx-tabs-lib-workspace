export interface ITabType {
  id: string,
  title: string,
  path: string,
  canClose?: boolean,
  active?: boolean,
  ignoreStrong?: boolean
}
