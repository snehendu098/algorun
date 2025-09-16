import { ScrollArea } from "@radix-ui/react-scroll-area";
import React from "react";

const RocketView = () => {
  return (
    <ScrollArea className="col-span-4 h-[85vh]">
      <div className="bg-card/50 w-full h-full rounded-xl"></div>
    </ScrollArea>
  );
};

export default RocketView;
