// src/utils/certificateGenerator.ts
import PDFDocument from 'pdfkit';
import Registration from '../models/Register';
import QRCode from 'qrcode';

// Enhanced certificate data interface
export interface ICertificateData {
  eventTitle: string;
  userName: string;
  eventDate: Date;
  eventVenue: string;
  eventLocation?: string;
  greeting?: string;
  issuedAt: Date;
  issuedBy: string;
  registrationId: string;
  eventId: string;
  userId: string;
}

// Enhanced certificate options with themes
export interface ICertificateOptions {
  greeting?: string;
  includeQRCode?: boolean;
  template?: 'classic' | 'modern' | 'elegant';
  theme?: 'corporate' | 'fun' | 'academic' | 'premium' | 'custom';
  primaryColor?: string;
  secondaryColor?: string;
  includeLogo?: boolean;
  includeSignature?: boolean;
  customFont?: string;
  fontSize?: 'small' | 'medium' | 'large';
}

// Predefined themes with complete styling
const themes = {
  corporate: {
    primary: '#2c3e50',
    secondary: '#3498db',
    accent: '#ecf0f1',
    background: '#ffffff',
    font: 'Helvetica-Bold',
    borderStyle: 'double'
  },
  fun: {
    primary: '#e67e22',
    secondary: '#f1c40f',
    accent: '#e74c3c',
    background: '#fefefe',
    font: 'Helvetica',
    borderStyle: 'rounded'
  },
  academic: {
    primary: '#1abc9c',
    secondary: '#16a085',
    accent: '#27ae60',
    background: '#fafafa',
    font: 'Times-Bold',
    borderStyle: 'classic'
  },
  premium: {
    primary: '#8e44ad',
    secondary: '#9b59b6',
    accent: '#e74c3c',
    background: '#fefefe',
    font: 'Helvetica-Bold',
    borderStyle: 'elegant'
  },
  custom: {
    primary: '#2c3e50',
    secondary: '#3498db',
    accent: '#ecf0f1',
    background: '#ffffff',
    font: 'Helvetica',
    borderStyle: 'simple'
  }
};

// Font size mappings
const fontSizes = {
  small: { title: 24, subtitle: 18, body: 14, small: 10 },
  medium: { title: 32, subtitle: 24, body: 18, small: 12 },
  large: { title: 40, subtitle: 30, body: 22, small: 14 }
};

/**
 * Generate certificate data from registration ID
 */
export const generateCertificateData = async (registrationId: string): Promise<ICertificateData> => {
  try {
    const registration = await Registration.findById(registrationId)
      .populate('user', 'name email')
      .populate('event', 'title date venue location')
      .populate('attendedBy', 'name');

    if (!registration) {
      throw new Error('Registration not found');
    }

    if (!registration.isAttended) {
      throw new Error('Cannot generate certificate for non-attended event');
    }

    const user = registration.user as any;
    const event = registration.event as any;
    const manager = registration.attendedBy as any;

    return {
      eventTitle: event.title,
      userName: user.name,
      eventDate: event.date,
      eventVenue: event.venue,
      eventLocation: event.location,
      greeting: 'Congratulations on successfully completing',
      issuedAt: registration.attendedAt || new Date(),
      issuedBy: manager?.name || 'Event Manager',
      registrationId: (registration._id as any).toString(),
      eventId: (event._id as any).toString(),
      userId: (user._id as any).toString()
    };
  } catch (error) {
    console.error('Error generating certificate data:', error);
    throw new Error(`Failed to generate certificate data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate PDF certificate with enhanced features
 */
export const generateCertificatePDF = async (
  registrationId: string,
  options: ICertificateOptions = {}
): Promise<Buffer> => {
  try {
    const data = await generateCertificateData(registrationId);
    const theme = themes[options.theme || 'corporate'];
    const fontSize = fontSizes[options.fontSize || 'medium'];
    
    // Override theme colors if custom colors provided
    if (options.primaryColor) theme.primary = options.primaryColor;
    if (options.secondaryColor) theme.secondary = options.secondaryColor;

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {});

    // Apply theme background
    doc.rect(0, 0, doc.page.width, doc.page.height)
       .fill(theme.background);

    // Generate certificate based on template
    switch (options.template || 'classic') {
      case 'classic':
        generateClassicCertificate(doc, data, theme, fontSize, options);
        break;
      case 'modern':
        generateModernCertificate(doc, data, theme, fontSize, options);
        break;
      case 'elegant':
        generateElegantCertificate(doc, data, theme, fontSize, options);
        break;
      default:
        generateClassicCertificate(doc, data, theme, fontSize, options);
    }

    // Add QR code if requested
    if (options.includeQRCode) {
      await addQRCode(doc, data, theme);
    }

    // Add logo if requested
    if (options.includeLogo) {
      addLogo(doc, theme);
    }

    // Add signature if requested
    if (options.includeSignature) {
      addSignature(doc, data, theme, fontSize);
    }

    doc.end();

    return Buffer.concat(chunks);
  } catch (error) {
    console.error('Error generating PDF certificate:', error);
    throw new Error(`Failed to generate PDF certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate streaming PDF certificate (for Express routes)
 */
export const generateStreamingCertificate = async (
  registrationId: string,
  options: ICertificateOptions = {},
  res: any
): Promise<void> => {
  try {
    const data = await generateCertificateData(registrationId);
    const theme = themes[options.theme || 'corporate'];
    const fontSize = fontSizes[options.fontSize || 'medium'];
    
    if (options.primaryColor) theme.primary = options.primaryColor;
    if (options.secondaryColor) theme.secondary = options.secondaryColor;

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${data.userName.replace(/\s+/g, '-')}.pdf"`);

    // Pipe directly to response
    doc.pipe(res);

    // Apply theme background
    doc.rect(0, 0, doc.page.width, doc.page.height)
       .fill(theme.background);

    // Generate certificate
    switch (options.template || 'classic') {
      case 'classic':
        generateClassicCertificate(doc, data, theme, fontSize, options);
        break;
      case 'modern':
        generateModernCertificate(doc, data, theme, fontSize, options);
        break;
      case 'elegant':
        generateElegantCertificate(doc, data, theme, fontSize, options);
        break;
      default:
        generateClassicCertificate(doc, data, theme, fontSize, options);
    }

    // Add optional features
    if (options.includeQRCode) {
      await addQRCode(doc, data, theme);
    }
    if (options.includeLogo) {
      addLogo(doc, theme);
    }
    if (options.includeSignature) {
      addSignature(doc, data, theme, fontSize);
    }

    doc.end();
  } catch (error) {
    console.error('Error generating streaming certificate:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
};

/**
 * Generate classic certificate template
 */
const generateClassicCertificate = (
  doc: PDFKit.PDFDocument,
  data: ICertificateData,
  theme: any,
  fontSize: any,
  options: ICertificateOptions
) => {
  const centerX = doc.page.width / 2;
  const centerY = doc.page.height / 2;

  // Double border
  doc.strokeColor(theme.primary)
     .lineWidth(3)
     .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
     .stroke();

  doc.strokeColor(theme.secondary)
     .lineWidth(1)
     .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
     .stroke();

  // Title
  doc.font(theme.font)
     .fontSize(fontSize.title)
     .fillColor(theme.primary)
     .text('CERTIFICATE OF COMPLETION', centerX, centerY - 120, { align: 'center' });

  // Greeting
  doc.fontSize(fontSize.subtitle)
     .fillColor(theme.secondary)
     .text(options.greeting || 'This is to certify that', centerX, centerY - 60, { align: 'center' });

  // Name
  doc.fontSize(fontSize.title)
     .fillColor(theme.primary)
     .text(data.userName, centerX, centerY, { align: 'center' });

  // Event details
  doc.fontSize(fontSize.body)
     .fillColor(theme.secondary)
     .text(`has successfully completed`, centerX, centerY + 60, { align: 'center' });

  doc.fontSize(fontSize.subtitle)
     .fillColor(theme.primary)
     .text(data.eventTitle, centerX, centerY + 120, { align: 'center' });

  // Date and venue
  doc.fontSize(fontSize.body)
     .fillColor(theme.secondary)
     .text(`Date: ${data.eventDate.toLocaleDateString()}`, centerX, centerY + 180, { align: 'center' });

  doc.fontSize(fontSize.body)
     .text(`Venue: ${data.eventVenue}`, centerX, centerY + 210, { align: 'center' });

  // Issued by
  doc.fontSize(fontSize.small)
     .fillColor(theme.primary)
     .text(`Issued by: ${data.issuedBy}`, centerX, centerY + 260, { align: 'center' });
};

/**
 * Generate modern certificate template
 */
const generateModernCertificate = (
  doc: PDFKit.PDFDocument,
  data: ICertificateData,
  theme: any,
  fontSize: any,
  options: ICertificateOptions
) => {
  const centerX = doc.page.width / 2;

  // Header section with gradient effect
  doc.rect(0, 0, doc.page.width, 120)
     .fill(theme.primary);

  // Header text
  doc.font(theme.font)
     .fontSize(fontSize.title)
     .fillColor('#ffffff')
     .text('CERTIFICATE', centerX, 60, { align: 'center' });

  // Main content area
  doc.rect(40, 140, doc.page.width - 80, doc.page.height - 200)
     .fill(theme.background)
     .stroke(theme.secondary)
     .stroke();

  // Greeting
  doc.fontSize(fontSize.subtitle)
     .fillColor(theme.secondary)
     .text(options.greeting || 'Congratulations!', centerX, 180, { align: 'center' });

  // Name
  doc.fontSize(fontSize.title)
     .fillColor(theme.primary)
     .text(data.userName, centerX, 240, { align: 'center' });

  // Event completion text
  doc.fontSize(fontSize.body)
     .fillColor(theme.secondary)
     .text('has successfully completed', centerX, 300, { align: 'center' });

  // Event title
  doc.fontSize(fontSize.subtitle)
     .fillColor(theme.primary)
     .text(data.eventTitle, centerX, 360, { align: 'center' });

  // Event details in grid
  const detailsY = 420;
  doc.fontSize(fontSize.body)
     .fillColor(theme.secondary);

  doc.text(`Date: ${data.eventDate.toLocaleDateString()}`, 80, detailsY);
  doc.text(`Venue: ${data.eventVenue}`, centerX, detailsY);
  doc.text(`Issued: ${data.issuedAt.toLocaleDateString()}`, doc.page.width - 200, detailsY);

  // Footer
  doc.fontSize(fontSize.small)
     .fillColor(theme.primary)
     .text(`Issued by: ${data.issuedBy}`, centerX, doc.page.height - 80, { align: 'center' });
};

/**
 * Generate elegant certificate template
 */
const generateElegantCertificate = (
  doc: PDFKit.PDFDocument,
  data: ICertificateData,
  theme: any,
  fontSize: any,
  options: ICertificateOptions
) => {
  const centerX = doc.page.width / 2;
  const centerY = doc.page.height / 2;

  // Corner decorations
  const cornerSize = 60;
  doc.strokeColor(theme.secondary)
     .lineWidth(2);

  // Top-left corner
  doc.moveTo(50, 50).lineTo(50 + cornerSize, 50)
     .moveTo(50, 50).lineTo(50, 50 + cornerSize).stroke();

  // Top-right corner
  doc.moveTo(doc.page.width - 50, 50).lineTo(doc.page.width - 50 - cornerSize, 50)
     .moveTo(doc.page.width - 50, 50).lineTo(doc.page.width - 50, 50 + cornerSize).stroke();

  // Bottom-left corner
  doc.moveTo(50, doc.page.height - 50).lineTo(50 + cornerSize, doc.page.height - 50)
     .moveTo(50, doc.page.height - 50).lineTo(50, doc.page.height - 50 - cornerSize).stroke();

  // Bottom-right corner
  doc.moveTo(doc.page.width - 50, doc.page.height - 50).lineTo(doc.page.width - 50 - cornerSize, doc.page.height - 50)
     .moveTo(doc.page.width - 50, doc.page.height - 50).lineTo(doc.page.width - 50, doc.page.height - 50 - cornerSize).stroke();

  // Central seal
  doc.circle(centerX, centerY + 100, 80)
     .stroke(theme.primary)
     .lineWidth(3);

  doc.circle(centerX, centerY + 100, 70)
     .stroke(theme.secondary)
     .lineWidth(1);

  // Title
  doc.font(theme.font)
     .fontSize(fontSize.title)
     .fillColor(theme.primary)
     .text('CERTIFICATE', centerX, centerY - 120, { align: 'center' });

  // Greeting
  doc.fontSize(fontSize.subtitle)
     .fillColor(theme.secondary)
     .text(options.greeting || 'This is to certify that', centerX, centerY - 60, { align: 'center' });

  // Name
  doc.fontSize(fontSize.title)
     .fillColor(theme.primary)
     .text(data.userName, centerX, centerY, { align: 'center' });

  // Event details
  doc.fontSize(fontSize.body)
     .fillColor(theme.secondary)
     .text(`has successfully completed`, centerX, centerY + 60, { align: 'center' });

  doc.fontSize(fontSize.subtitle)
     .fillColor(theme.primary)
     .text(data.eventTitle, centerX, centerY + 140, { align: 'center' });

  // Date and venue
  doc.fontSize(fontSize.body)
     .fillColor(theme.secondary)
     .text(`Date: ${data.eventDate.toLocaleDateString()}`, centerX, centerY + 200, { align: 'center' });

  doc.fontSize(fontSize.body)
     .text(`Venue: ${data.eventVenue}`, centerX, centerY + 230, { align: 'center' });

  // Issued by
  doc.fontSize(fontSize.small)
     .fillColor(theme.primary)
     .text(`Issued by: ${data.issuedBy}`, centerX, centerY + 280, { align: 'center' });
};

/**
 * Add real QR code to certificate
 */
const addQRCode = async (
  doc: PDFKit.PDFDocument,
  data: ICertificateData,
  theme: any
): Promise<void> => {
  try {
    const qrPayload = JSON.stringify({
      registrationId: data.registrationId,
      eventId: data.eventId,
      userId: data.userId,
      verifiedAt: new Date().toISOString(),
      eventTitle: data.eventTitle,
      userName: data.userName
    });

    const qrImage = await QRCode.toDataURL(qrPayload, {
      width: 100,
      margin: 2,
      color: {
        dark: theme.primary,
        light: theme.background
      }
    });

    // Position QR code in bottom-right corner
    const qrSize = 80;
    const qrX = doc.page.width - qrSize - 60;
    const qrY = doc.page.height - qrSize - 60;

    doc.image(qrImage, qrX, qrY, {
      width: qrSize,
      height: qrSize
    });

    // Add verification text
    doc.fontSize(8)
       .fillColor(theme.secondary)
       .text('Scan to verify', qrX + qrSize/2 - 20, qrY + qrSize + 5, { align: 'center' });

  } catch (error) {
    console.error('Error adding QR code:', error);
    // Continue without QR code if generation fails
  }
};

/**
 * Add logo to certificate
 */
const addLogo = (doc: PDFKit.PDFDocument, theme: any): void => {
  try {
    // For now, we'll add a placeholder logo area
    // In production, you'd load an actual logo file
    const logoSize = 60;
    const logoX = 60;
    const logoY = 40;

    // Placeholder logo (circle with text)
    doc.circle(logoX + logoSize/2, logoY + logoSize/2, logoSize/2)
       .fill(theme.primary);

    doc.fontSize(12)
       .fillColor('#ffffff')
       .text('LOGO', logoX + logoSize/2, logoY + logoSize/2 + 4, { align: 'center' });

  } catch (error) {
    console.error('Error adding logo:', error);
  }
};

/**
 * Add signature to certificate
 */
const addSignature = (
  doc: PDFKit.PDFDocument,
  data: ICertificateData,
  theme: any,
  fontSize: any
): void => {
  try {
    const signatureY = doc.page.height - 120;
    const signatureX = doc.page.width - 200;

    // Signature line
    doc.strokeColor(theme.secondary)
       .lineWidth(1)
       .moveTo(signatureX, signatureY)
       .lineTo(signatureX + 150, signatureY)
       .stroke();

    // Signature text
    doc.fontSize(fontSize.small)
       .fillColor(theme.primary)
       .text(data.issuedBy, signatureX + 75, signatureY + 10, { align: 'center' });

    // Title
    doc.fontSize(fontSize.small)
       .fillColor(theme.secondary)
       .text('Event Manager', signatureX + 75, signatureY + 25, { align: 'center' });

  } catch (error) {
    console.error('Error adding signature:', error);
  }
};

/**
 * Generate certificate with custom theme
 */
export const generateCustomThemeCertificate = (
  registrationId: string,
  customTheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    font: string;
    borderStyle: string;
  },
  options: ICertificateOptions = {}
): Promise<Buffer> => {
  const theme = { ...themes.custom, ...customTheme };
  return generateCertificatePDF(registrationId, { ...options, theme: 'custom' });
};

/**
 * Get available themes
 */
export const getAvailableThemes = () => {
  return Object.keys(themes).map(key => ({
    name: key,
    colors: themes[key as keyof typeof themes]
  }));
};

/**
 * Validate certificate options
 */
export const validateCertificateOptions = (options: ICertificateOptions): string[] => {
  const errors: string[] = [];

  if (options.primaryColor && !/^#[0-9A-F]{6}$/i.test(options.primaryColor)) {
    errors.push('Invalid primary color format. Use hex format (e.g., #2c3e50)');
  }

  if (options.secondaryColor && !/^#[0-9A-F]{6}$/i.test(options.secondaryColor)) {
    errors.push('Invalid secondary color format. Use hex format (e.g., #3498db)');
  }

  if (options.template && !['classic', 'modern', 'elegant'].includes(options.template)) {
    errors.push('Invalid template. Choose from: classic, modern, elegant');
  }

  if (options.theme && !['corporate', 'fun', 'academic', 'premium', 'custom'].includes(options.theme)) {
    errors.push('Invalid theme. Choose from: corporate, fun, academic, premium, custom');
  }

  if (options.fontSize && !['small', 'medium', 'large'].includes(options.fontSize)) {
    errors.push('Invalid font size. Choose from: small, medium, large');
  }

  return errors;
};
