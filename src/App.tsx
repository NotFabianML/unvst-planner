import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import useStore from "./store/useStore";
import Semester from "./components/Semester";
import SubjectCard from "./components/SubjectCard";
import Loader from "./components/Loader";

function App() {
  const {
    semesters,
    availableSubjects,
    initialized,
    initializeData,
    resetPlan,
    addToSemester,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");

  // Filtrar materias disponibles
  const filteredSubjects = availableSubjects.filter(
    (subject) =>
      subject.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.codigo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!initialized) initializeData();
  }, [initialized, initializeData]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.data?.current?.semesterNumber !== undefined) {
      const sourceSemester = semesters.find((sem) =>
        sem.subjects.some((s) => s.codigo === active.id)
      );

      // Solo permitir mover desde disponibles o entre semestres
      if (!sourceSemester || sourceSemester.number !== 0) {
        addToSemester(
          active.data.current?.subject,
          over.data.current.semesterNumber
        );
      }
    }
  };

  if (!initialized) return <Loader />;

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-row p-10 ml-6 mx-auto h-screen w-screen gap-20">
          <div>
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">UNVST PLANNER</h1>
              <button
                onClick={resetPlan}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Reiniciar Plan
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {semesters.map((semester) => (
                <Semester
                  key={semester.number}
                  number={semester.number}
                  subjects={semester.subjects}
                />
              ))}
            </div>
          </div>
          <div className="w-screen md:w-1/3">	
            <div>
              <div className="flex flex-col gap-4 justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Materias Disponibles ({availableSubjects.length})
                </h2>
                <input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="overflow-y-auto h-[80vh] flex flex-col items-center">
                {filteredSubjects.map((subject) => (
                  <SubjectCard key={subject.codigo} subject={subject} />
                ))}
                {filteredSubjects.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No se encontraron materias
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DndContext>

      <Toaster position="top-center" richColors expand={false} />
    </>
  );
}

export default App;
