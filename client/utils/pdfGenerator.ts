import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/lib/supabase';
import { storage } from '@/utils/storage';
import { data } from '@/lib/data';

export interface PDFGenerationOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}

export class UpgradeRequiredError extends Error {
  code = 'UPGRADE_REQUIRED' as const;
  constructor(message = 'Upgrade required to continue') {
    super(message);
    this.name = 'UpgradeRequiredError';
  }
}

async function ensurePdfAllowed() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) {
    const err = new Error('Authentication required');
    (err as any).code = 'AUTH_REQUIRED';
    throw err;
  }
  const plan = storage.getPlan(user.id);
  const resumes = await data.getResumes(user.id);

  // If user has no resumes yet, create the first one automatically so future attempts are counted.
  if (resumes.length === 0) {
    const id = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await data.addResume(user.id, {
      id,
      name: 'My Resume',
      template: 'modern',
      status: 'Draft',
    });
    return; // allow first download
  }

  // For Free plan, block 2nd+ attempt
  if (plan === 'Free' && resumes.length >= 1) {
    throw new UpgradeRequiredError('Free plan allows 1 resume');
  }
}

export const generatePDF = async (
  elementId: string,
  options: PDFGenerationOptions = {}
): Promise<void> => {
  const {
    filename = 'resume.pdf',
    quality = 3.0,
    format = 'a4',
    orientation = 'portrait'
  } = options;

  try {
    await ensurePdfAllowed();

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = 'wait';

    const A4_WIDTH_PX = 794;
    const A4_HEIGHT_PX = 1123;

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = `${A4_WIDTH_PX}px`;
    tempContainer.style.height = `${A4_HEIGHT_PX}px`;
    tempContainer.style.overflow = 'visible';
    tempContainer.style.backgroundColor = '#ffffff';

    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.width = `${A4_WIDTH_PX}px`;
    clonedElement.style.height = 'auto';
    clonedElement.style.minHeight = `${A4_HEIGHT_PX}px`;
    clonedElement.style.transform = 'none';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '0';

    const scaledElements = clonedElement.querySelectorAll('*');
    scaledElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style.transform && htmlEl.style.transform.includes('scale')) {
        htmlEl.style.transform = htmlEl.style.transform.replace(/scale\([^)]*\)/g, '');
      }
    });

    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(clonedElement, {
      scale: quality,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: A4_WIDTH_PX,
      height: Math.max(A4_HEIGHT_PX, clonedElement.scrollHeight),
      scrollX: 0,
      scrollY: 0,
      removeContainer: false,
      imageTimeout: 15000,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedBody = clonedDoc.body;
        clonedBody.style.fontFamily = 'Inter, system-ui, sans-serif';
        clonedBody.style.fontSize = '11px';
        clonedBody.style.lineHeight = '1.4';
      }
    });

    document.body.removeChild(tempContainer);

    const pdfWidth = format === 'a4' ? 210 : 215.9;
    const pdfHeight = format === 'a4' ? 297 : 279.4;

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: format === 'a4' ? 'a4' : 'letter',
      compress: true
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    const canvasAspectRatio = canvas.width / canvas.height;
    const pdfAspectRatio = pdfWidth / pdfHeight;

    let finalWidth = pdfWidth;
    let finalHeight = pdfHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspectRatio > pdfAspectRatio) {
      finalHeight = pdfWidth / canvasAspectRatio;
      offsetY = (pdfHeight - finalHeight) / 2;
    } else {
      finalWidth = pdfHeight * canvasAspectRatio;
      offsetX = (pdfWidth - finalWidth) / 2;
    }

    pdf.addImage(
      imgData,
      'JPEG',
      offsetX,
      offsetY,
      finalWidth,
      finalHeight,
      undefined,
      'FAST'
    );

    pdf.save(filename);

    document.body.style.cursor = originalCursor;

  } catch (error) {
    document.body.style.cursor = 'default';
    console.error('Error generating PDF:', error);
    if ((error as any)?.code === 'UPGRADE_REQUIRED') throw error;
    if ((error as any)?.code === 'AUTH_REQUIRED') throw error;
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const generatePDFPreview = async (
  elementId: string,
  options: PDFGenerationOptions = {}
): Promise<string> => {
  const {
    quality = 2.0,
    format = 'a4',
    orientation = 'portrait'
  } = options;

  try {
    await ensurePdfAllowed();

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const A4_WIDTH_PX = 794;
    const A4_HEIGHT_PX = 1123;

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = `${A4_WIDTH_PX}px`;
    tempContainer.style.height = `${A4_HEIGHT_PX}px`;
    tempContainer.style.overflow = 'visible';
    tempContainer.style.backgroundColor = '#ffffff';

    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.width = `${A4_WIDTH_PX}px`;
    clonedElement.style.height = 'auto';
    clonedElement.style.minHeight = `${A4_HEIGHT_PX}px`;
    clonedElement.style.transform = 'none';

    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(clonedElement, {
      scale: quality,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: A4_WIDTH_PX,
      height: Math.max(A4_HEIGHT_PX, clonedElement.scrollHeight),
      logging: false
    });

    document.body.removeChild(tempContainer);

    const pdfWidth = format === 'a4' ? 210 : 215.9;
    const pdfHeight = format === 'a4' ? 297 : 279.4;

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: format === 'a4' ? 'a4' : 'letter'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const canvasAspectRatio = canvas.width / canvas.height;
    const pdfAspectRatio = pdfWidth / pdfHeight;

    let finalWidth = pdfWidth;
    let finalHeight = pdfHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspectRatio > pdfAspectRatio) {
      finalHeight = pdfWidth / canvasAspectRatio;
      offsetY = (pdfHeight - finalHeight) / 2;
    } else {
      finalWidth = pdfHeight * canvasAspectRatio;
      offsetX = (pdfWidth - finalWidth) / 2;
    }

    pdf.addImage(imgData, 'JPEG', offsetX, offsetY, finalWidth, finalHeight);

    return pdf.output('datauristring');

  } catch (error) {
    console.error('Error generating PDF preview:', error);
    if ((error as any)?.code === 'UPGRADE_REQUIRED') throw error;
    if ((error as any)?.code === 'AUTH_REQUIRED') throw error;
    throw new Error('Failed to generate PDF preview.');
  }
};

export const isPDFGenerationSupported = (): boolean => {
  return typeof window !== 'undefined' &&
         typeof document !== 'undefined' &&
         !!window.HTMLCanvasElement;
};

export const validateResumeData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.contact?.fullName?.trim()) {
    errors.push('Full name is required');
  }

  if (!data.contact?.email?.trim()) {
    errors.push('Email is required');
  }

  if (!data.contact?.email?.includes('@')) {
    errors.push('Valid email is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
