import React, { useState } from "react";
import { render } from "react-dom";
import styled from "styled-components";
import DocViewer, { DocViewerRenderers, IRenderSettings } from ".";

const Container = styled.div`
  position: relative;

  .dock-bar-container { 
    position: absolute;
    bottom: 20px;
    width: 100%;
 
    .dock-bar { 
      margin: 0 auto;
      max-width: 400px;
      padding: 10px 20px;
      border-radius: 3px;
      color: #fff;
      background: rgba(0, 0, 0, .5);

      display: flex;
      justify-content: center;
      gap: 8px;

      button { 
        border: none;
        border-radius: 3px;
        font-family: "Roboto", sans-serif;

        &:hover { 
          background: #ccc;
        }
      }
    }
  }
`;

function DocViewerContainer(props: any) {
  const [controller, setController] = useState<any>();
  const [settings, setSettings] = useState<any>();

  React.useEffect(() => {
    if (!settings || !controller) return;
    controller.update(settings);
  }, [controller, settings]);

  React.useEffect(() => {
    setController(undefined);
    setSettings(undefined);
  }, [props])

  const changeSettings = (key: string, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  }

  return (
    <Container>
      <DocViewer
        documents={[props.document]}
        pluginRenderers={DocViewerRenderers}
        onLoaded={(data) => {
          console.log("Loaded", data);
          setSettings(data.state);
          setController(data.controller);
        }}
        onChange={(state) => {
          console.log("Changed", state);
          setSettings(state);
        }}
        config={{
          noRenderer: {
            overrideComponent: () => <div />,
          },
          loadingRenderer: {
            overrideComponent: () => <div>Loading ...</div>,
          }
        }}
      />

      {Boolean(settings && controller) && (
        <div className="dock-bar-container">
          <div className="dock-bar">
            {settings.paginated && (<>
              <div className="dock-bar-item">
                <button onClick={() => changeSettings("currentPage", settings.currentPage - 1)}>
                  prev
                </button>
              </div>
              <div className="dock-bar-item">{`Page ${settings.currentPage}/${settings.pagesCount}`}</div><div className="dock-bar-item">
                <button onClick={() => changeSettings("currentPage", settings.currentPage + 1)}>
                  next
                </button>
              </div>
            </>
            )}
            <div className="dock-bar-item">
              <button onClick={() => changeSettings("zoomLevel", settings.zoomLevel - 0.1)}>
                -
              </button>
            </div>
            <div className="dock-bar-item">
              <button onClick={() => changeSettings("zoomLevel", settings.zoomLevel + 0.1)}>
                +
              </button>
            </div>
            <div className="dock-bar-item">
              <button onClick={() => changeSettings("rotationAngle", settings.rotationAngle - 90)}>
                rotate to left
              </button>
            </div>
            <div className="dock-bar-item">
              <button onClick={() => changeSettings("rotationAngle", settings.rotationAngle + 90)}>
                rotate to right
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );

}

const App = () => {
  const docs = [
    // { uri: require("./examples/png-image.png") },
    { uri: require("./examples/example-pdf.pdf") },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <>
      <button type="button" className="switch-button" onClick={() => setCurrentIndex(currentIndex + 1 >= docs.length ? 0 : currentIndex + 1)}>switch document</button>
      <DocViewerContainer document={docs[currentIndex]} />
    </>
  )
};

render(<App />, document.getElementById("root"));
