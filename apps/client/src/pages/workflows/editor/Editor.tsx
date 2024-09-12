import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Switch } from "@/components/ui/switch";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import NodeSettings from "../components/NodeSettings";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";

const Editor = () => {
  return (
    <div className="h-[1000vh]">
      <div className=" scroll-auto duration-0 items-stretch gap-[4px] flex flex-row shrink-0 h-[49px] justify-between w-full leading-[15px] pr-[20px]  border-b border-solid">
        <div
          data-variant="default"
          className="box-border scroll-auto duration-0 flex flex-auto max-w-full relative leading-[15px] -mb-px pt-[10px] pb-[11px] px-[12px]"
        >
          <div
            tabIndex={0}
            data-orientation="horizontal"
            className="box-border scroll-auto duration-0 gap-[4px] flex flex-row min-w-0 leading-[15px]"
          ></div>
        </div>
        <div className="box-border scroll-auto duration-0 items-center gap-[12px] flex flex-row shrink-0 justify-start leading-[15px]">
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
            Draft
          </span>
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
            Active
          </span>

          <Switch id="" />
        </div>
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="p-2" minSize={60}>
          <ReactFlowProvider>
            <Flow />
          </ReactFlowProvider>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={25} className="p-3">
          <div className="flex items-center gap-4 mb-3">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </div>
          <Separator />
          <br />
          <NodeSettings />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Editor;
function Flow() {
  const [nodes, , onNodesChange] = useNodesState([
    {
      id: "a",
      type: "input",
      position: { x: 500, y: 400 },
      data: { label: "wire" },
    },
    { id: "c", position: { x: 700, y: 600 }, data: { label: "your ideas" } },
    {
      id: "d",
      type: "output",
      position: { x: 800, y: 700 },
      data: { label: "with React Flow" },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: "a->c", source: "a", target: "c", animated: true },
    { id: "c->d", source: "c", target: "d", animated: true },
  ]);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges],
  );
  useEffect(() => {
    console.log(nodes, edges);
  }, [edges, nodes]);

  return (
    <ReactFlow
      nodes={nodes}
      onConnect={onConnect}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <Background
        gap={7}
        // @ts-ignore
        variant="dots"
        size={1}
      />
      <Controls
        position="top-left"
        className="text-black"
        showFitView={false}
        showInteractive={false}
      />
      <MiniMap
        zoomable
        pannable
        position="bottom-left"
        className="!bg-background"
      />
    </ReactFlow>
  );
}
