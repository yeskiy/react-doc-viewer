import React, { CSSProperties, FC, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { HeaderBar } from "./components/HeaderBar";
import { ProxyRenderer } from "./components/ProxyRenderer";
import BMPRenderer from "./plugins/bmp";
import HTMLRenderer from "./plugins/html";
import ImageProxyRenderer from "./plugins/image";
import JPGRenderer from "./plugins/jpg";
import MSDocRenderer from "./plugins/msdoc";
import MSGRenderer from "./plugins/msg";
import PDFRenderer from "./plugins/pdf";
import PNGRenderer from "./plugins/png";
import TIFFRenderer from "./plugins/tiff";
import TXTRenderer from "./plugins/txt";
import { AppProvider, RenderProvider } from "./state";
import { defaultTheme } from "./theme";
import {
  DocRenderer,
  IConfig,
  IDocument,
  IRenderSettings,
  ITheme,
} from "./types";
import { createEvent, emitEvent } from "./utils/events";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
`;

export interface DocViewerProps {
  documents: IDocument[];
  renderSettings?: IRenderSettings;
  className?: string;
  style?: CSSProperties;
  config?: IConfig;
  theme?: ITheme;
  prefetchMethod?: string;
  pluginRenderers?: DocRenderer[];
  onLoaded?: (data?: any) => void;
  onChange?: (data?: any) => void;
}

const DocViewerProxy: FC<any> = ({ applicationProps }) => {
  if (!applicationProps.documents || applicationProps.documents === undefined) {
    throw new Error("Please provide an array of documents to DocViewer!");
  }

  return (
    <AppProvider {...applicationProps}>
      <ThemeProvider
        theme={
          applicationProps.theme
            ? { ...defaultTheme, ...applicationProps.theme }
            : defaultTheme
        }
      >
        <RenderProvider>
          <Container
            id="react-doc-viewer"
            data-testid="react-doc-viewer"
            {...applicationProps}
          >
            <HeaderBar />
            <ProxyRenderer />
          </Container>
        </RenderProvider>
      </ThemeProvider>
    </AppProvider>
  );
};

const MemorizedDocViewerProxy = React.memo(
  DocViewerProxy,
  ({ applicationProps: prev }, { applicationProps: current }) =>
    prev.documents.every((item: any) =>
      current.documents.every((item2: any) => item2.uri === item.uri)
    )
);

export default ({
  onLoaded,
  onChange,
  renderSettings,
  ...applicationProps
}: DocViewerProps) => {
  const [appProviderProps, setAppProviderProps] =
    React.useState(applicationProps);

  React.useEffect(() => {
    setAppProviderProps(applicationProps);
  }, [applicationProps.documents]);

  React.useEffect(() => {
    createEvent("core:onRenderSettingsChange", (data) => {
      if (onChange) onChange(data);
    });

    createEvent("onDocumentLoaded", (data) => {
      if (onLoaded) onLoaded(data);
    });
  }, []);

  return <MemorizedDocViewerProxy applicationProps={appProviderProps} />;
};

export { DocViewerRenderers } from "./plugins";
export * from "./types";
export * from "./utils/fileLoaders";
export {
  BMPRenderer,
  HTMLRenderer,
  ImageProxyRenderer,
  JPGRenderer,
  MSDocRenderer,
  MSGRenderer,
  PDFRenderer,
  PNGRenderer,
  TIFFRenderer,
  TXTRenderer,
};
