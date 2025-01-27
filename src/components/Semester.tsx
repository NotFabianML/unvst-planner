import { useDroppable } from "@dnd-kit/core";
import SubjectCard from "./SubjectCard";
import type { Semester } from "../types";
import useStore from "../store/useStore";

const Semester = ({ number, subjects }: Semester) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `semester-${number}`,
    data: { semesterNumber: number },
  });
  const { removeFromSemester } = useStore();

  return (
    <div
      ref={setNodeRef}
      className={`p-6 rounded-lg min-h-[200px] mb-4 border-2 transition-all duration-200
        ${
          number === 0
            ? "bg-purple-900/30 border-purple-500"
            : "bg-gray-800 border-gray-700"
        }
        ${isOver ? "opacity-75 scale-95" : ""}`}
    >
      <h3 className="text-xl font-bold mb-4 text-white">
        {number === 0 ? (
          <>
            📜 Convalidaciones
            <span className="ml-2 text-sm text-purple-300">
              (previas aprobadas)
            </span>
          </>
        ) : (
          `📚 Cuatrimestre ${number}`
        )}
        <span className="ml-2 text-sm text-gray-400">({subjects.length})</span>
      </h3>
      <div className="space-y-4">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.codigo}
            subject={subject}
            onRemove={() => removeFromSemester(subject.codigo, number)}
          />
        ))}
        {subjects.length === 0 && (
          <p className="text-gray-500 text-sm italic">
            {number === 0
              ? "Arrastra materias convalidadas aquí"
              : "Arrastra materias aquí"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Semester;
