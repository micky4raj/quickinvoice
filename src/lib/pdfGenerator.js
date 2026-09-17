import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Renders the given DOM node (the invoice sheet) to a single-page A4 PDF,
// entirely in the browser — no upload, no server round-trip.
export async function exportInvoiceToPDF(node, fileName) {
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#fffdf9',
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const imgRatio = canvas.height / canvas.width
  let renderWidth = pageWidth
  let renderHeight = pageWidth * imgRatio

  // If content overflows one page, scale down to fit rather than crop —
  // multi-page pagination can be added later if invoices grow past this.
  if (renderHeight > pageHeight) {
    renderHeight = pageHeight
    renderWidth = pageHeight / imgRatio
  }

  const x = (pageWidth - renderWidth) / 2
  pdf.addImage(imgData, 'PNG', x, 0, renderWidth, renderHeight)
  pdf.save(fileName || 'invoice.pdf')
}
