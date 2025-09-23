import React from 'react';

const PageSize = 18;

export type CrossMultiplePagesListProps<T> = {
  header?: React.ReactNode;
  headerSize?: number;
  list: T[];
  renderPage: (page: T[], index?: number, first?: boolean) => React.ReactNode;
};

export const CrossMultiplePagesList = <T,>(props: CrossMultiplePagesListProps<T>) => {
  const { headerSize = 0, list, header, renderPage } = props;
  const { pages } = chunkList(list, PageSize - headerSize);
  // console.log('----------CrossMultiplePagesList-----------');
  // console.log('headerSize, list,  pages', headerSize, list, pages);
  // console.log('----------CrossMultiplePagesList-----------');

  return pages.map((page, index) => {
    const total = page.length + (index === 0 ? headerSize : 0);
    if (total === PageSize) {
      return (
        <section className='page' key={index}>
          {index === 0 && header}
          {renderPage(page, index)}
        </section>
      );
    } else if (total > PageSize) {
      return (
        <React.Fragment key={index}>
          <section className='page'>{header}</section>
          <section className='page'>{renderPage(page, index)}</section>
        </React.Fragment>
      );
    }
    return null;
  });
};

const chunkList = <T,>(list: T[], firstChunkSize: number, skipFirst = false) => {
  const pages: T[][] = [];
  let index = 0;
  while (index < list.length) {
    let size = PageSize;
    if (index === 0 && firstChunkSize > 0) {
      size = firstChunkSize;
    }
    if (!skipFirst || index !== 0) {
      pages.push(list.slice(index, size + index));
    }
    index += size;
  }
  return { pages, availableSizeOnLast: getAvailableOnLast(pages, firstChunkSize) };
};

const getAvailableOnLast = <T,>(chunks: T[][], initial: number) => {
  const initialAvailable = initial === 0 ? PageSize : initial;
  if (chunks.length === 0) {
    return initialAvailable;
  }
  const last = chunks[chunks.length - 1];
  return chunks.length === 1 ? initialAvailable - last.length : PageSize - last.length;
};

export const Rest = <T,>({
  header,
  headerSize = 0,
  list,
  renderPage
}: CrossMultiplePagesListProps<T>) => {
  const { pages, availableSizeOnLast } = chunkList(list, PageSize - headerSize);
  const last = pages[pages.length - 1];
  // console.log('-------------rest--------------');
  // console.log(
  //   'pages headerSize availableSizeOnLast last',
  //   pages,
  //   headerSize,
  //   availableSizeOnLast,
  //   last
  // );
  // console.log('-------------rest--------------');

  return (
    availableSizeOnLast > 0 && (
      <>
        {pages.length <= 1 && headerSize !== PageSize && header}
        {last && renderPage(last, undefined, pages.length === 1)}
      </>
    )
  );
};

export const getRestSize = <T,>(
  list: CrossMultiplePagesListProps<T>['list'],
  headerSize: CrossMultiplePagesListProps<T>['headerSize'] = 0
) => {
  const { availableSizeOnLast } = chunkList(list, PageSize - headerSize);
  const used = PageSize - availableSizeOnLast;
  return used === PageSize ? 0 : used;
};
