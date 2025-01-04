declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf'
  
  interface UserOptions {
    head?: string[][]
    body?: string[][]
    startY?: number
    styles?: {
      fontSize?: number
      cellPadding?: number
      margin?: { top: number }
    }
    headStyles?: {
      fillColor?: number[]
      textColor?: number
      fontStyle?: string
    }
    columnStyles?: {
      [key: number]: {
        cellWidth?: number
      }
    }
    alternateRowStyles?: {
      fillColor?: number[]
    }
    didDrawPage?: (data: { pageNumber: number; pageCount: number }) => void
    margin?: { top: number }
  }

  function autoTable(doc: jsPDF, options: UserOptions): void
  export default autoTable
} 