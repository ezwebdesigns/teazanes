import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import QuoteCard from "./QuoteCard";
import { cn } from "@/lib/utils";

export default function KanbanColumn({ status, title, subtitle, accent, records, onOpen }) {
  return (
    <div className="flex min-h-[240px] w-full flex-col rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", accent)} />
          <h3 className="text-sm font-semibold text-stone-700">{title}</h3>
        </div>
        <span className="rounded-full border border-stone-200 bg-white px-2 py-0.5 text-xs text-stone-500">
          {records.length}
        </span>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex min-h-[120px] flex-1 flex-col gap-2.5 rounded-xl p-1 transition-colors",
              snapshot.isDraggingOver && "bg-emerald-100/40"
            )}
          >
            {records.map((r, i) => (
              <QuoteCard key={r.id} record={r} index={i} onOpen={onOpen} />
            ))}
            {provided.placeholder}
            {records.length === 0 && (
              <p className="mt-6 text-center text-xs text-stone-400">{subtitle}</p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}