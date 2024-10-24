import { useState, useEffect } from 'react';

import fetchApi from 'nextjs/utils/fetchApi';

interface SignatureLookupResponse {
  ok: boolean;
  error?: string;
  result?: {
    event: Record<string, unknown>;
    function: Record<string, Array<{ name: string; filtered: boolean }>>;
  };
}

export function useOpenChainFunctionSelector(functionSelector: string) {
  const [ errorName, setErrorName ] = useState<string | null>(null);
  const [ loadingErrorName, setLoadingErrorName ] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchErrorName = async() => {
      setLoadingErrorName(true);
      try {
        const data = await fetchApi<never, SignatureLookupResponse>({
          url: `https://api.openchain.xyz/signature-database/v1/lookup`,
          route: `/signature-database/v1/lookup`,
          queryParams: {
            'function': `0x${ functionSelector }`,
            filter: 'true',
          },
          timeout: 3000,
        });

        if (isMounted) {
          if (
            data &&
            data.ok &&
            data.result &&
            data.result.function[`0x${ functionSelector }`]
          ) {
            const functions = data.result.function[`0x${ functionSelector }`];
            if (functions.length > 0) {
              const errorEntry = functions[0];
              setErrorName(errorEntry.name);
            } else {
              setErrorName(null);
            }
          } else {
            setErrorName(null);
          }
        }
      } catch (error) {
        if (isMounted) {
          setErrorName(null);
        }
      } finally {
        if (isMounted) {
          setLoadingErrorName(false);
        }
      }
    };

    fetchErrorName();

    return () => {
      isMounted = false;
    };
  }, [ functionSelector ]);

  return { errorName, loadingErrorName };
}
