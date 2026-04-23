// @vitest-environment jsdom
import {describe, it, vi} from 'vitest';

import {downloadFile} from './downloadFile';

describe('downloadFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('URL', {createObjectURL: vi.fn()});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should create an anchor element and trigger a download', () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(HTMLAnchorElement.prototype, 'remove');
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click');

    const mockContent = 'Test content';
    const mockFileName = 'test.txt';
    const mockContentType = 'text/plain';

    downloadFile(mockContent, mockFileName, mockContentType);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeSpy.mockRestore();
    clickSpy.mockRestore();
  });

  it('should use default content type if not provided', () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    const mockContent = 'Test content';
    const mockFileName = 'test.txt';

    downloadFile(mockContent, mockFileName);

    const anchor = createElementSpy.mock.results[0].value as HTMLAnchorElement;
    const blob = new Blob([mockContent], {type: 'application/text;charset=utf-8'});
    const expectedHref = URL.createObjectURL(blob);

    expect(String(anchor.getAttribute('href'))).toEqual(String(expectedHref));

    createElementSpy.mockRestore();
  });

  it('should set the correct file name for the download', () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    const mockContent = 'Test content';
    const mockFileName = 'test.txt';

    downloadFile(mockContent, mockFileName);

    const anchor = createElementSpy.mock.results[0].value as HTMLAnchorElement;
    expect(anchor.download).toBe(mockFileName);

    createElementSpy.mockRestore();
  });
});
