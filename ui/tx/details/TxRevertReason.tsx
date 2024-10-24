import { Grid, GridItem, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { TransactionRevertReason } from 'types/api/transaction';

import hexToUtf8 from 'lib/hexToUtf8';
import { HEX_REGEXP } from 'lib/regexp';
import { useOpenChainFunctionSelector } from 'lib/useOpenChainFunctionSelector';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';

type Props = TransactionRevertReason;

const TxRevertReason = (props: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  const raw = 'raw' in props ? props.raw : null;
  const isRawHex = raw && HEX_REGEXP.test(raw);
  const functionSelector = isRawHex ? raw.slice(0, 10).toLowerCase() : '';
  const { errorName, loadingErrorName } = useOpenChainFunctionSelector(functionSelector);

  if ('raw' in props) {
    if (!HEX_REGEXP.test(props.raw)) {
      return <Text>{ raw }</Text>;
    }

    return (
      <Grid
        bgColor={ bgColor }
        p={ 4 }
        fontSize="sm"
        borderRadius="md"
        templateColumns="auto minmax(0, 1fr)"
        rowGap={ 2 }
        columnGap={ 4 }
        whiteSpace="normal"
      >
        <GridItem fontWeight={ 500 }>Raw:</GridItem>
        <GridItem>{ raw }</GridItem>
        { errorName && (
          <>
            <GridItem fontWeight={ 500 }>Error:</GridItem>
            <GridItem>{ errorName }</GridItem>
          </>
        ) }
        { !errorName && !loadingErrorName && (
          <>
            <GridItem fontWeight={ 500 }>Decoded:</GridItem>
            <GridItem>{ hexToUtf8(raw) }</GridItem>
          </>
        ) }
        { loadingErrorName && (
          <>
            <GridItem fontWeight={ 500 }>Error:</GridItem>
            <GridItem>Loading...</GridItem>
          </>
        ) }
      </Grid>
    );
  } else {
    return <LogDecodedInputData data={ props }/>;
  }

};

export default React.memo(TxRevertReason);
