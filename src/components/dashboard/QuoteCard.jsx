import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import moment from "moment";
import { FlaskConical, Leaf, MailCheck, Package, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuoteCard({ record, index, onOpen }) {
  const isCustom = record.service_type === "private_label_custom";
  const sent = !!record.quote_sent_date;
  const chip =
    "inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-500";

  return (
    <Draggable draggableId={record.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onOpen(record)}
          className={cn(
            "cursor-pointer rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md",
            snapshot.isDragging && "shadow-lg ring-2 ring-emerald-600/30"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-snug text-stone-800">{record.business_name}</p>
            {sent && <MailCheck className="h-4 w-4 shrink-0 text-emerald-600" />}
          </div>
          <p className="mt-0.5 text-xs text-stone-500">{record.full_name}</p>
          <p className="truncate text-xs text-stone-400">{record.email}</p>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className={chip}>
              {isCustom ? <FlaskConical className="h-3 w-3" /> : <Package className="h-3 w-3" />}
              {isCustom ? "Custom" : record.category === "pyramid" ? "Pyramides" : "Vrac"}
            </span>
            {!isCustom && record.blends?.length > 0 && (
              <span className={chip}>
                <Leaf className="h-3 w-3" />
                {record.blends.length} mélanges
              </span>
            )}
            {record.status === "validated" && !sent && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700">
                À envoyer
              </span>
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[11px] text-stone-400">{moment(record.created_date).fromNow()}</span>
            {record.status === "new" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900 px-2.5 py-1 text-[11px] font-medium text-white">
                <Send className="h-3 w-3" />
                Valider
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}