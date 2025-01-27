export interface Subject {
    codigo: string;
    nombre: string;
    HL: number;
    HP: number;
    HE: number;
    Cr: number;
    requisitos: string[] | null;
    cuatrimestre?: number;
  }
  
  export interface Semester {
    number: number;
    subjects: Subject[];
  }