import { Tr, Td, Icon, Grid, Skeleton, Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import eastArrowIcon from 'icons/arrows/east.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Tag from 'ui/shared/chakra/Tag';
import TokenTransferNft from 'ui/shared/TokenTransfer/TokenTransferNft';

type Props = TokenTransfer & { tokenId?: string; isLoading?: boolean }

const TokenTransferTableItem = ({
  token,
  total,
  tx_hash: txHash,
  from,
  to,
  method,
  timestamp,
  tokenId,
  isLoading,
}: Props) => {
  const value = (() => {
    if (!('value' in total)) {
      return '-';
    }

    return BigNumber(total.value).div(BigNumber(10 ** Number(total.decimals))).dp(8).toFormat();
  })();

  const timeAgo = useTimeAgoIncrement(timestamp, true);

  return (
    <Tr alignItems="top">
      <Td>
        <Grid alignItems="center" gridTemplateColumns="auto 130px" width="fit-content" py="7px">
          <Address display="inline-flex" fontWeight={ 600 }>
            <AddressLink type="transaction" hash={ txHash } isLoading={ isLoading }/>
          </Address>
          { timestamp && (
            <Skeleton isLoaded={ !isLoading } display="inline-block" color="gray.500" fontWeight="400" ml="10px">
              { timeAgo }
            </Skeleton>
          ) }
        </Grid>
      </Td>
      <Td>
        <Box my="3px">
          <Tag isLoading={ isLoading } isTruncated>{ method }</Tag>
        </Box>
      </Td>
      <Td>
        <Address display="inline-flex" maxW="100%" py="3px">
          <AddressIcon address={ from } isLoading={ isLoading }/>
          <AddressLink
            ml={ 2 }
            flexGrow={ 1 }
            fontWeight="500"
            type="address_token"
            hash={ from.hash }
            alias={ from.name }
            tokenHash={ token.address }
            truncation="constant"
            isLoading={ isLoading }
          />
        </Address>
      </Td>
      <Td px={ 0 }>
        <Skeleton isLoaded={ !isLoading } boxSize={ 6 } my="3px">
          <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500"/>
        </Skeleton>
      </Td>
      <Td>
        <Address display="inline-flex" maxW="100%" py="3px">
          <AddressIcon address={ to } isLoading={ isLoading }/>
          <AddressLink
            ml={ 2 }
            flexGrow={ 1 }
            fontWeight="500"
            type="address_token"
            hash={ to.hash }
            alias={ to.name }
            tokenHash={ token.address }
            truncation="constant"
            isLoading={ isLoading }
          />
        </Address>
      </Td>
      { (token.type === 'ERC-721' || token.type === 'ERC-1155') && (
        <Td>
          { 'token_id' in total ? (
            <TokenTransferNft
              hash={ token.address }
              id={ total.token_id }
              justifyContent={ token.type === 'ERC-721' ? 'end' : 'start' }
              isDisabled={ Boolean(tokenId && tokenId === total.token_id) }
              isLoading={ isLoading }
            />
          ) : '-'
          }
        </Td>
      ) }
      { (token.type === 'ERC-20' || token.type === 'ERC-1155') && (
        <Td isNumeric verticalAlign="top">
          <Skeleton isLoaded={ !isLoading } my="7px">
            { value || '-' }
          </Skeleton>
        </Td>
      ) }
    </Tr>
  );
};

export default React.memo(TokenTransferTableItem);
