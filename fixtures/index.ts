import { mergeTests, expect } from '@playwright/test';
import { test as uiTest } from './ui.fixtures';

export const test = mergeTests(uiTest);
export { expect };