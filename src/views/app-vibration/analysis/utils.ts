import { coordMarkLine } from '../../../components';

export function getTransparentCoordLine(area: string[], coord: [number, number]) {
  const [start, end] = area;
  return coordMarkLine.get(
    [
      [start, 0],
      [end, 0]
    ],
    coord,
    {
      label: {
        formatter: ({ value }: { value: unknown }) => `${value ?? ''}`,
        position: 'middle'
      },
      lineStyle: { color: 'transparent' }
    }
  );
}
