import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Subject } from "../types";
import { X } from "lucide-react";

const SubjectCard = ({
  subject,
  onRemove,
}: {
  subject: Subject;
  onRemove?: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: subject.codigo,
      data: { subject },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: "transform 0.2s ease",
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div className="group my-4 p-4 min-w-[400px] max-w-[400px] bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] rounded-2xl shadow-lg transition-colors duration-200 relative flex flex-row items-center gap-4">
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="h-full"
      >
        <div className="mb-2 flex justify-between gap-6 text-sm font-bold">
          <span>{subject.nombre}</span>
          <span>{subject.codigo}</span>
        </div>
        <div className="flex justify-items-start gap-6 text-gray-400 text-xs">
          <span className="text-red-700 font-bold">
            C{subject.cuatrimestre}
          </span>
          <span>Créditos: {subject.Cr}</span>
          <span>Requisitos: {subject.requisitos?.join(", ") || "Ninguno"}</span>
        </div>
      </div>

      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="h-min w-min m-0 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-2 opacity-0
          group-hover:opacity-100 transition-opacity shadow-md hover:shadow-red-500/40
          backdrop-blur-sm"
          title="Devolver a disponibles"
        >
          <X size={16} className="stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};

export default SubjectCard;
