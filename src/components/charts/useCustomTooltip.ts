export type TooltipItem = { marker: string; name: string; text: string };

export const buildCustomTooltip = ({
  title,
  items
}: {
  title?: React.ReactNode;
  items: TooltipItem[];
}) => {
  let template = `<div style="line-height:1;">`;
  if (title) {
    template += `${title}\n`;
  }
  items.forEach(({ marker, name, text }) => {
    template += `<div style='display:flex;justify-content:space-between;`;
    if (title) {
      template += `margin-top:10px;`;
    }
    template += `line-height:1;'><span style='flex:0 0 auto'>${marker} ${name}</span><strong style='flex:0 0 auto; text-align:right;text-indent:1em;'>${text}</strong></div>`;
  });
  template += `</div>`;
  return template;
};
