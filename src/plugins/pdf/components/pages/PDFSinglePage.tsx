import React, { FC, useContext } from "react";
import { Page } from "react-pdf";
import styled from "styled-components";
import { DocViewerContext, RenderContext } from "../../../../state";
import { IStyledProps } from "../../../../types";

interface Props {
  pageNum?: number;
}

const PDFSinglePage: FC<Props> = (props) => {
  const { pageNum } = props;

  const { 
    state: {rendererRect},
  } = useContext(DocViewerContext);  
  const {
    state: {
      paginated, zoomLevel, pagesCount, currentPage 
    },
  } = useContext(RenderContext);

  const _pageNum = pageNum || currentPage;

  return (
    <PageWrapper id="pdf-page-wrapper" last={_pageNum >= pagesCount}>
      {!paginated && (
        <PageTag id="pdf-page-info">
          Page {_pageNum}/{pagesCount}
        </PageTag>
      )}
      <Page
        pageNumber={_pageNum || currentPage}
        scale={zoomLevel}
        height={(rendererRect?.height || 100) - 100}
        width={(rendererRect?.width || 100) - 100}
      />
    </PageWrapper>
  );
};

export default PDFSinglePage;

interface PageWrapperProps {
  last?: boolean;
}
const PageWrapper = styled.div<PageWrapperProps>`
  margin: 20px 0;
`;
const PageTag = styled.div`
  padding: 0 0 10px 10px;
  color: ${(props: IStyledProps) => props.theme.textTertiary};
  font-size: 14px;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;
