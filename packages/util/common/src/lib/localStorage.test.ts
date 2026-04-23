/**
 * @jest-environment jsdom
 */
import {act, renderHook} from '@testing-library/react';

import {useLocalStorage} from './localStorage';

describe(useLocalStorage, () => {
  it('should return false as pass in', () => {
    const {result} = renderHook(() => useLocalStorage('test-local', false));

    expect(result.current[0]).toBe(false);
  });

  it('bool should set value', () => {
    const {result} = renderHook(() => useLocalStorage('test-local', false));

    const [, setValue] = result.current;

    act(() => setValue('test-local', true));

    expect(result.current[0]).toBe(true);

    act(() => setValue('test-local', false));

    expect(result.current[0]).toBe(false);
  });

  it('string should set value', () => {
    const {result} = renderHook(() => useLocalStorage('test-local', {test: 'test'}));

    const [, setValue] = result.current;

    act(() => setValue('test-local', {test: 'test-1'}));

    expect(result.current[0].test).toBe('test-1');

    act(() => setValue('test-local', {test: 'test-2'}));

    expect(result.current[0].test).toBe('test-2');
  });
});
