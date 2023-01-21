import type { AppProps } from "@/types";
import React from "react";

export type PreviewContextState = {
  ref: React.MutableRefObject<HTMLIFrameElement | null>;
  reload: () => void;
};

export const PreviewContext = React.createContext<
  PreviewContextState | undefined
>(undefined);

export type PreviewProviderProps = AppProps;

export function PreviewProvider(props: PreviewProviderProps) {
  const { children } = props;
  const previewRef = React.useRef<HTMLIFrameElement | null>(null);

  const reloadPreview = () => {
    const iframe = previewRef.current;

    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.location.reload();
    }
  };

  const values: PreviewContextState = {
    ref: previewRef,
    reload: reloadPreview,
  };

  return (
    <PreviewContext.Provider value={values}>{children}</PreviewContext.Provider>
  );
}

export const usePreviewContext = () => React.useContext(PreviewContext);
