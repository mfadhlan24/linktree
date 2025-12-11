// utils/pdfHelpers.js
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const UNSUPPORTED_COLOR_FUNCS = ["oklch(", "oklab(", "lab(", "lch(", "color("];

export function patchColorsForHtml2Canvas(clonedDoc) {
  const win = clonedDoc.defaultView;
  if (!win) return;

  clonedDoc.querySelectorAll("*").forEach((node) => {
    const st = win.getComputedStyle(node);
    [
      "color",
      "background-color",
      "border-color",
      "outline-color",
      "text-decoration-color",
      "box-shadow",
    ].forEach((prop) => {
      const val = st.getPropertyValue(prop);
      if (val && UNSUPPORTED_COLOR_FUNCS.some((f) => val.includes(f))) {
        if (prop === "background-color") {
          node.style.setProperty(prop, "#ffffff", "important");
        } else if (prop === "box-shadow") {
          node.style.setProperty(prop, "none", "important");
        } else {
          node.style.setProperty(prop, "#000000", "important");
        }
      }
    });
  });

  clonedDoc.querySelectorAll(".pdf-page").forEach((pageEl) => {
    pageEl.style.boxShadow = "none";
    pageEl.style.backgroundColor = "#ffffff";
  });
}

export async function elementToPdfBlobCanvas(el, dpiScale = 3) {
  const width = el.scrollWidth || el.getBoundingClientRect().width;
  const height = el.scrollHeight || el.getBoundingClientRect().height;

  const canvas = await html2canvas(el, {
    scale: dpiScale,
    useCORS: true,
    backgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: -window.scrollY,
    width,
    height,
    onclone: (clonedDoc) => patchColorsForHtml2Canvas(clonedDoc),
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.98);
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  let imgWidth = pageWidth;
  let imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (imgHeight > pageHeight) {
    imgHeight = pageHeight;
    imgWidth = (canvas.width * imgHeight) / canvas.height;
  }

  const x = (pageWidth - imgWidth) / 2;
  const y = 0;

  pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
  return pdf.output("blob");
}
