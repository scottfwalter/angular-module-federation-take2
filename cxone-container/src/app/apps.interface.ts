export interface AppDefinition {
  path?: string;
  startsWith?: string;
  remoteEntry: string;
  remoteName: string;
  exposedModule: string;
  elementName: string;
}
