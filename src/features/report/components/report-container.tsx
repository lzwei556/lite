import { ArrowLeftOutlined } from '@ant-design/icons';
import { Space, Spin } from 'antd';
import { Card, DownloadIconButton, Flex, IconButton } from 'components';
import html2pdf from 'html2pdf.js';
import { Translation } from 'locales/utils';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ReportContainer = ({
  children,
  filename
}: {
  children: React.ReactNode;
  filename: string;
}) => {
  const cardRef = React.createRef<HTMLDivElement>();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  return (
    <Flex justify='center'>
      <Space
        style={{ position: 'fixed', width: '210mm', transform: 'translate(185mm, 5mm)', zIndex: 2 }}
      >
        <IconButton
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          tooltipProps={{ title: Translation.get('common.action.return') }}
        />
        <DownloadIconButton
          onClick={() => {
            if (cardRef.current) {
              setLoading(true);
              try {
                generatePDF(cardRef.current, filename, () => setLoading(false));
              } catch (error) {
                setLoading(false);
              }
            }
          }}
        />
      </Space>
      <Spin spinning={loading}>
        <Card
          style={{ position: 'relative', width: '210mm',  }}
          styles={{ body: { paddingBlock: 24, paddingInline: 32 } }}
        >
          <div ref={cardRef}>{children}</div>
        </Card>
      </Spin>
    </Flex>
  );
};

const generatePDF = (target: HTMLDivElement, filename: string, onSuccess: () => void) => {
  html2pdf()
    .from(target)
    .set({
      margin: 10,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        dpi: 300,
        letterRendering: true,
        useCORS: true
        // ignoreElements: (element: HTMLDivElement) => {
        //   if (element.id === 'download-btn') {
        //     return true;
        //   }
        //   return false;
        // }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: {
        avoid: ['.chart', 'h4', 'tr', 'td', 'li']
        // before: '.page-break'
      },
      filename
    } as any)
    .toPdf()
    .get('pdf')
    .then(function (pdf) {
      var totalPages = pdf.internal.getNumberOfPages();
      for (var i = 1; i <= totalPages; i++) {
        if (i > 1) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.setTextColor(150);
          pdf.text(
            i + ' / ' + totalPages,
            pdf.internal.pageSize.getWidth() / 2 - 1,
            pdf.internal.pageSize.getHeight() - 5
          );
        }
      }
    })
    //@ts-ignore
    .save()
    .then(onSuccess);
};
