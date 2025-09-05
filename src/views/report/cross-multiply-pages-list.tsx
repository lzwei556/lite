import React from 'react';

const PageSize = 15;

export type CrossMultiplePagesListProps<T> = {
  header?: React.ReactNode;
  headerSize?: number; // 长度不超过PageSize, 否则请手动分页
  list: T[];
  renderPage: (page: T[], index?: number, first?: boolean) => React.ReactNode;
};

export const CrossMultiplePagesList = <T,>({
  header,
  headerSize = 0,
  list,
  renderPage
}: CrossMultiplePagesListProps<T>) => {
  const pages = chunkList(list, PageSize - headerSize);
  if (pages.length === 1 && pages[0].length + headerSize === PageSize) {
    return (
      <section>
        {header}
        {renderPage(pages[0], 0)}
      </section>
    );
  } else {
    return pages
      .filter((_, i) => i !== pages.length - 1)
      .map((page, index) => (
        <section className='page'>
          {index === 0 && header}
          {renderPage(page, index)}
        </section>
      ));
  }
};

const chunkList = <T,>(list: T[], firstChunkSize: number, skipFirst = false) => {
  const res: T[][] = [];
  let index = 0;
  while (index < list.length) {
    let size = PageSize;
    if (index === 0) {
      size = firstChunkSize;
    }
    if (!skipFirst || index !== 0) {
      res.push(list.slice(index, size + index));
    }
    index += size;
  }
  return res;
};

export const Rest = <T,>({
  header,
  headerSize = 0,
  list,
  renderPage
}: CrossMultiplePagesListProps<T>) => {
  const pages = chunkList(list, PageSize - headerSize);
  const availableSize = getAvailableOnLast(pages, headerSize);
  const last = pages[pages.length - 1];

  return (
    availableSize > 0 && (
      <>
        {pages.length <= 1 && header}
        {pages.length > 0 && renderPage(last, undefined, pages.length === 1)}
      </>
    )
  );
};

const getAvailableOnLast = <T,>(chunks: T[][], initial: number) => {
  if (chunks.length === 0) {
    return initial;
  }
  const last = chunks[chunks.length - 1];
  return chunks.length === 1 ? initial - last.length : PageSize - last.length;
};

export const getRestSize = <T,>(
  list: CrossMultiplePagesListProps<T>['list'],
  headerSize: CrossMultiplePagesListProps<T>['headerSize'] = 0
) => {
  const availableSize = PageSize - headerSize;
  const pages = chunkList(list, availableSize);
  const used = PageSize - getAvailableOnLast(pages, availableSize);
  return used === PageSize ? 0 : used;
};
