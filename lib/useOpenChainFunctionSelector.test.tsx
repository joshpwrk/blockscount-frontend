import fetchApi from 'nextjs/utils/fetchApi';

import { renderHook, wrapper, waitFor } from 'jest/lib'; // Using your custom utility

import { useOpenChainFunctionSelector } from './useOpenChainFunctionSelector';

jest.mock('nextjs/utils/fetchApi');

const mockFetchApi = fetchApi as jest.MockedFunction<typeof fetchApi>;

describe('useOpenChainFunctionSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set errorName correctly for a successful response (functionSelector: 0xcbff8323)', async() => {
    const functionSelector = 'cbff8323';
    const mockData = {
      ok: true,
      result: {
        event: {},
        'function': {
          '0xcbff8323': [ { name: 'InvalidAccountNonce(address,address)', filtered: false } ],
        },
      },
    };
    mockFetchApi.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useOpenChainFunctionSelector(functionSelector), { wrapper });

    await waitFor(() => {
      expect(result.current.errorName).toBe('InvalidAccountNonce(address,address)');
      expect(result.current.loadingErrorName).toBe(false);
    });
  });

  it('should set errorName to null for an error response (functionSelector: 0xcbff832)', async() => {
    const functionSelector = 'cbff832';
    const mockData = {
      ok: false,
      error: 'failed to load signatures',
    };
    mockFetchApi.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useOpenChainFunctionSelector(functionSelector), { wrapper });

    await waitFor(() => {
      expect(result.current.errorName).toBe(null);
      expect(result.current.loadingErrorName).toBe(false);
    });
  });

  it('should set errorName to null for no signature found (functionSelector: 0x00000008)', async() => {
    const functionSelector = '00000008';
    const mockData = {
      ok: true,
      result: {
        event: {},
        'function': {
          '0x00000008': [],
        },
      },
    };
    mockFetchApi.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useOpenChainFunctionSelector(functionSelector), { wrapper });

    await waitFor(() => {
      expect(result.current.errorName).toBe(null);
      expect(result.current.loadingErrorName).toBe(false);
    });
  });

  it('should set loadingErrorName to true while fetching', async() => {
    const functionSelector = 'cbff8323';
    const mockData = {
      ok: true,
      result: {
        event: {},
        'function': {
          '0xcbff8323': [ { name: 'InvalidAccountNonce(address,address)', filtered: false } ],
        },
      },
    };
    mockFetchApi.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useOpenChainFunctionSelector(functionSelector), { wrapper });

    // Initially, loading should be true
    expect(result.current.loadingErrorName).toBe(true);

    // Wait for the hook to finish updating
    await waitFor(() => {
      expect(result.current.loadingErrorName).toBe(false);
    });
  });
});
