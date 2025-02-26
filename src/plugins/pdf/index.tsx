// @ts-ignore
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import React from "react";
import { pdfjs } from "react-pdf";
import styled from "styled-components";
import { DocRenderer, IStyledProps } from "../../types";
import PDFPages from "./components/pages/PDFPages";
import PDFControls from "./components/PDFControls";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;

  /* width */
  &::-webkit-scrollbar {
    ${(props: IStyledProps) =>
      props.theme.disableThemeScrollbar ? "" : "width: 10px"};
  }
  /* Track */
  &::-webkit-scrollbar-track {
    /* background: ${(props: IStyledProps) => props.theme.secondary}; */
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: ${(props: IStyledProps) => props.theme.tertiary};
  }
  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: ${(props: IStyledProps) => props.theme.primary};
  }
`;

const PDFRenderer: DocRenderer = () => (
  <Container id="pdf-renderer" data-testid="pdf-renderer">
    <PDFControls />
    <PDFPages />
  </Container>
);

export default PDFRenderer;

PDFRenderer.fileTypes = ["pdf", "application/pdf"];
PDFRenderer.weight = 0;
