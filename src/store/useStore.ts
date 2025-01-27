import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import subjectsData from "../data/subjects.json";
import { Subject, Semester } from "../types";
import { toast } from "sonner";

type State = {
  availableSubjects: Subject[];
  semesters: Semester[];
  initialized: boolean;
};

type Actions = {
  addToSemester: (subject: Subject, semesterNumber: number) => void;
  removeFromSemester: (subjectCode: string, semesterNumber: number) => void;
  checkPrerequisites: (subject: Subject, targetSemester: number) => boolean;
  resetPlan: () => void;
  initializeData: () => void;
};

const initialSemesters = (): Semester[] => [
  { number: 0, subjects: [] },
  ...Array.from({ length: 9 }, (_, i) => ({
    number: i + 1,
    subjects: [],
  })),
];

const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      availableSubjects: [],
      semesters: initialSemesters(),
      initialized: false,

      initializeData: () => {
        try {
          const allSubjects = subjectsData.flatMap((semester) =>
            semester.asignaturas.map((subj) => ({
              ...subj,
              cuatrimestre: semester.cuatrimestre,
            }))
          );

          set({
            availableSubjects: allSubjects,
            semesters: initialSemesters(),
            initialized: true,
          });
          toast.success("Datos inicializados correctamente");
        } catch (err) {
          toast.error("Error cargando materias" + err);
        }
      },

      addToSemester: (subject, semesterNumber) => {
        if (semesterNumber !== 0) {
          const hasConflict = subject.requisitos?.some(req => 
            get().semesters
              .find(sem => sem.number === semesterNumber)
              ?.subjects.some(s => s.codigo === req)
          );
      
          if (hasConflict) {
            toast.error(`No puedes agregar ${subject.nombre} junto con sus requisitos en el mismo semestre`);
            return;
          }
        }
        
        const currentSemester = get().semesters.find((sem) =>
          sem.subjects.some((s) => s.codigo === subject.codigo)
        );

        set((state) => ({
          semesters: state.semesters.map((sem) => {
            // Remover de cualquier semestre anterior
            if (currentSemester && sem.number === currentSemester.number) {
              return {
                ...sem,
                subjects: sem.subjects.filter(
                  (s) => s.codigo !== subject.codigo
                ),
              };
            }
            // Agregar al nuevo semestre
            if (sem.number === semesterNumber) {
              return { ...sem, subjects: [...sem.subjects, subject] };
            }
            return sem;
          }),
          availableSubjects: state.availableSubjects.filter(
            (s) => s.codigo !== subject.codigo
          ),
        }));

        toast.success(
          currentSemester
            ? `Materia movida al ${semesterNumber === 0 ? "convalidaciones" : `cuatrimestre ${semesterNumber}`}`
            : `Materia agregada al ${semesterNumber === 0 ? "convalidaciones" : `cuatrimestre ${semesterNumber}`}`
        );
      },

      removeFromSemester: (subjectCode, semesterNumber) => {
        set((state) => {
          // Encontrar el semestre y la materia a remover
          const currentSemester = state.semesters.find((sem) => sem.number === semesterNumber);
          const removedSubject = currentSemester?.subjects.find((s) => s.codigo === subjectCode);
      
          // Si no existe la materia, retornar el estado actual
          if (!removedSubject) return state;
      
          // Actualizar los semestres
          const updatedSemesters = state.semesters.map((sem) =>
            sem.number === semesterNumber
              ? { ...sem, subjects: sem.subjects.filter((s) => s.codigo !== subjectCode) }
              : sem
          );
      
          // Agregar la materia de vuelta a la lista de materias disponibles
          const updatedAvailableSubjects = [...state.availableSubjects, removedSubject];
      
          return {
            semesters: updatedSemesters,
            availableSubjects: updatedAvailableSubjects,
          };
        });
      
        toast.info("Materia devuelta a disponibles");
      },
      

      checkPrerequisites: (subject, targetSemester) => {
        if (!subject.requisitos) return true;

        const targetSemesterSubjects =
          get()
            .semesters.find((sem) => sem.number === targetSemester)
            ?.subjects.map((s) => s.codigo) || [];

        const completedSubjects = get()
          .semesters.filter(
            (sem) => sem.number < targetSemester || sem.number === 0
          )
          .flatMap((sem) => sem.subjects)
          .map((s) => s.codigo);

        return subject.requisitos.every(
          (req) =>
            completedSubjects.includes(req) &&
            !targetSemesterSubjects.includes(req) // No permitir requisitos en el mismo semestre
        );
      },

      resetPlan: () => {
        set({
          semesters: initialSemesters(),
          availableSubjects: subjectsData.flatMap((semester) =>
            semester.asignaturas.map((subj) => ({
              ...subj,
              cuatrimestre: semester.cuatrimestre,
            }))
          ),
        });
        toast.success("Plan reiniciado correctamente");
      },
    }),
    {
      name: "semester-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        semesters: state.semesters,
        availableSubjects: state.availableSubjects,
      }),
    }
  )
);

export default useStore;
