export { FlooringSystemSection } from './FlooringSystemSection';
export type { FlooringSystemSectionProps } from './FlooringSystemSection';

// Re-exported for Plans C/D that import everything from @/components/home/FlooringSystem
export {
  FlooringSystemClient,
  type FlooringSystemClientProps,
} from '../FlooringSystemClient';

export { FlooringMiniModel } from './FlooringMiniModel';
export type { FlooringMiniModelProps } from './FlooringMiniModel';

export {
  FLOORING_SYSTEMS,
  FLOORING_SYSTEM_LIST,
  getFlooringSystem,
  DEFAULT_FLOORING_SYSTEM_ID,
} from './flooring-systems';
export type {
  FlooringSystem,
  FlooringSystemId,
  FlooringLayer,
} from './flooring-systems';
