import React, { ReactNode } from 'react';
import { useSize } from 'ahooks';
import { Space } from '../../common';
import { Flex } from '../flex';
import { Card } from '../card/card';

export const TitleExtraLayout = ({
  title,
  extra,
  paddingBlock = 0
}: {
  title: ReactNode;
  extra?: ReactNode;
  paddingBlock?: number;
}) => {
  const cardRef = React.useRef(null);
  const cardSize = useSize(cardRef);
  const titleRef = React.useRef(null);
  const titleSize = useSize(titleRef);
  const extraRef = React.useRef(null);
  const extraSize = useSize(extraRef);
  const isWrap = (cardSize?.width ?? 0) < (titleSize?.width ?? 0) + (extraSize?.width ?? 0) + 26;

  return (
    <Card
      ref={cardRef}
      styles={{ body: isWrap ? { padding: `${Space}px ${Space}px 0` } : { paddingBlock } }}
    >
      {cardSize && (
        <Flex align='center' justify='flex-start' wrap={isWrap}>
          <div ref={titleRef}>{title}</div>
          {extra && (
            <Flex flex={1} justify={isWrap ? 'flex-start' : 'flex-end'} ref={extraRef}>
              {extra}
            </Flex>
          )}
        </Flex>
      )}
    </Card>
  );
};
