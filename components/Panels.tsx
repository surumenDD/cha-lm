"use client";
import { Panel, PanelGroup, PanelProps, PanelGroupProps, PanelResizeHandle } from "react-resizable-panels";

export const Panels = {
  Group: (props: PanelGroupProps) => <PanelGroup {...props} />,
  Pane: (props: PanelProps) => <Panel {...props} />,
  Handle: () => <PanelResizeHandle className="w-px bg-gray-200" />,
}; 