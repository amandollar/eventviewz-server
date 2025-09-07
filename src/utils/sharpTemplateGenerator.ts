// src/utils/sharpTemplateGenerator.ts - Windows-compatible template certificate generator
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import QRCode from 'qrcode';
// Certificate data interface
export interface ICertificateData {
  eventTitle: string;
  userName: string;
  eventDate: Date;
  eventVenue: string;
  eventLocation: string;
  greeting: string;
  issuedAt: Date;
  issuedBy: string;
  registrationId: string;
  eventId: string;
  userId: string;
}

// Template configuration interface
export interface ITemplateConfig {
  id: string;
  name: string;
  filename: string;
  textAreas: {
    title: { x: number; y: number; width: number; height: number; fontSize: number; color: string; fontFamily: string };
    userName: { x: number; y: number; width: number; height: number; fontSize: number; color: string; fontFamily: string };
    eventTitle: { x: number; y: number; width: number; height: number; fontSize: number; color: string; fontFamily: string };
    date: { x: number; y: number; width: number; height: number; fontSize: number; color: string; fontFamily: string };
    venue: { x: number; y: number; width: number; height: number; fontSize: number; color: string; fontFamily: string };
    issuedBy: { x: number; y: number; width: number; height: number; fontSize: number; color: string; fontFamily: string };
    qrCode?: { x: number; y: number; size: number };
  };
}

// Template-based certificate options
export interface ITemplateCertificateOptions {
  templateId?: string;
  includeQRCode?: boolean;
  customText?: {
    title?: string;
    greeting?: string;
    completionText?: string;
  };
  fontSize?: 'small' | 'medium' | 'large';
  textColor?: string;
  qrCodeColor?: string;
}

// Predefined template configurations
const templateConfigs: ITemplateConfig[] = [
  {
    id: 'template1',
    name: 'Classic Template',
    filename: 'Template1.jpeg',
    textAreas: {
      title: { x: 490, y: 80, width: 200, height: 30, fontSize: 16, color: '#2c3e50', fontFamily: 'Arial' }, // Organization name in dash
      userName: { x: 490, y: 200, width: 200, height: 40, fontSize: 24, color: '#2c3e50', fontFamily: 'Arial Bold' }, // Person's name
      eventTitle: { x: 490, y: 300, width: 200, height: 30, fontSize: 14, color: '#34495e', fontFamily: 'Arial' }, // Event title
      date: { x: 200, y: 500, width: 150, height: 30, fontSize: 14, color: '#2c3e50', fontFamily: 'Arial' }, // Date on left
      venue: { x: 490, y: 350, width: 200, height: 30, fontSize: 12, color: '#7f8c8d', fontFamily: 'Arial' }, // Venue
      issuedBy: { x: 700, y: 500, width: 150, height: 30, fontSize: 14, color: '#2c3e50', fontFamily: 'Arial' }, // Signature on right
      qrCode: { x: 50, y: 50, size: 80 }
    }
  },
  {
    id: 'template2',
    name: 'Modern Template',
    filename: 'Template2.jpeg',
    textAreas: {
      title: { x: 350, y: 120, width: 500, height: 70, fontSize: 52, color: '#ffffff', fontFamily: 'Arial' },
      userName: { x: 350, y: 220, width: 500, height: 90, fontSize: 40, color: '#2c3e50', fontFamily: 'Arial' },
      eventTitle: { x: 350, y: 360, width: 500, height: 70, fontSize: 32, color: '#34495e', fontFamily: 'Arial' },
      date: { x: 350, y: 480, width: 250, height: 50, fontSize: 20, color: '#7f8c8d', fontFamily: 'Arial' },
      venue: { x: 350, y: 530, width: 250, height: 50, fontSize: 20, color: '#7f8c8d', fontFamily: 'Arial' },
      issuedBy: { x: 350, y: 620, width: 500, height: 50, fontSize: 18, color: '#95a5a6', fontFamily: 'Arial' },
      qrCode: { x: 50, y: 50, size: 120 }
    }
  }
];

// Font size multipliers
const fontSizeMultipliers = {
  small: 0.8,
  medium: 1.0,
  large: 1.2
};

/**
 * Get available templates
 */
export const getAvailableTemplates = (): ITemplateConfig[] => {
  return templateConfigs.map(config => ({
    ...config,
    // Check if template file exists
    available: fs.existsSync(path.join(__dirname, '../../template', config.filename))
  }));
};

/**
 * Load template image
 */
const loadTemplateImage = async (templateId: string): Promise<Buffer> => {
  const template = templateConfigs.find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  const templatePath = path.join(__dirname, '../../template', template.filename);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file ${template.filename} not found`);
  }

  return fs.readFileSync(templatePath);
};

/**
 * Generate QR code for certificate
 */
const generateQRCode = async (data: ICertificateData, color: string = '#000000'): Promise<Buffer> => {
  const qrPayload = JSON.stringify({
    registrationId: data.registrationId,
    eventId: data.eventId,
    userId: data.userId,
    verifiedAt: new Date().toISOString(),
    eventTitle: data.eventTitle,
    userName: data.userName
  });

  const qrDataURL = await QRCode.toDataURL(qrPayload, {
    width: 200,
    margin: 2,
    color: {
      dark: color,
      light: '#ffffff'
    }
  });

  // Convert data URL to buffer
  const base64Data = qrDataURL.split(',')[1];
  return Buffer.from(base64Data || '', 'base64');
};

/**
 * Create SVG text element
 */
const createSVGText = (
  text: string,
  x: number,
  y: number,
  fontSize: number,
  color: string,
  fontFamily: string,
  textAnchor: string = 'middle',
  maxWidth?: number
): string => {
  // Simple text wrapping for SVG
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    if (maxWidth && testLine.length * (fontSize * 0.6) > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.map((line, index) => 
    `<text x="${x}" y="${y + (index * fontSize * 1.2)}" font-family="${fontFamily}" font-size="${fontSize}" fill="${color}" text-anchor="${textAnchor}">${line}</text>`
  ).join('\n');
};

/**
 * Generate certificate using Sharp and SVG
 */
export const generateTemplateCertificate = async (
  data: ICertificateData,
  options: ITemplateCertificateOptions = {}
): Promise<Buffer> => {
  try {
    const templateId = options.templateId || 'template1';
    const template = templateConfigs.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Load template image
    const templateBuffer = await loadTemplateImage(templateId);
    
    // Get template image metadata
    const templateImage = sharp(templateBuffer);
    const metadata = await templateImage.metadata();
    const width = metadata.width || 1200;
    const height = metadata.height || 800;

    // Apply font size multiplier
    const sizeMultiplier = fontSizeMultipliers[options.fontSize || 'medium'];

    // Create SVG overlay
    const svgOverlay = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Organization Name (in dash area) -->
        ${createSVGText(
          options.customText?.title || 'EventViewz Organization',
          template.textAreas.title.x + template.textAreas.title.width / 2,
          template.textAreas.title.y + template.textAreas.title.fontSize * sizeMultiplier,
          template.textAreas.title.fontSize * sizeMultiplier,
          options.textColor || template.textAreas.title.color,
          template.textAreas.title.fontFamily,
          'middle',
          template.textAreas.title.width
        )}
        
        <!-- Person's Name (main area) -->
        ${createSVGText(
          data.userName,
          template.textAreas.userName.x + template.textAreas.userName.width / 2,
          template.textAreas.userName.y + template.textAreas.userName.fontSize * sizeMultiplier,
          template.textAreas.userName.fontSize * sizeMultiplier,
          options.textColor || template.textAreas.userName.color,
          template.textAreas.userName.fontFamily,
          'middle',
          template.textAreas.userName.width
        )}
        
        <!-- Event Title -->
        ${createSVGText(
          data.eventTitle,
          template.textAreas.eventTitle.x + template.textAreas.eventTitle.width / 2,
          template.textAreas.eventTitle.y + template.textAreas.eventTitle.fontSize * sizeMultiplier,
          template.textAreas.eventTitle.fontSize * sizeMultiplier,
          options.textColor || template.textAreas.eventTitle.color,
          template.textAreas.eventTitle.fontFamily,
          'middle',
          template.textAreas.eventTitle.width
        )}
        
        <!-- Venue -->
        ${createSVGText(
          data.eventVenue,
          template.textAreas.venue.x + template.textAreas.venue.width / 2,
          template.textAreas.venue.y + template.textAreas.venue.fontSize * sizeMultiplier,
          template.textAreas.venue.fontSize * sizeMultiplier,
          options.textColor || template.textAreas.venue.color,
          template.textAreas.venue.fontFamily,
          'middle',
          template.textAreas.venue.width
        )}
        
        <!-- Date (left side) -->
        ${createSVGText(
          data.eventDate.toLocaleDateString(),
          template.textAreas.date.x,
          template.textAreas.date.y + template.textAreas.date.fontSize * sizeMultiplier,
          template.textAreas.date.fontSize * sizeMultiplier,
          options.textColor || template.textAreas.date.color,
          template.textAreas.date.fontFamily,
          'start'
        )}
        
        <!-- Signature (right side) -->
        ${createSVGText(
          data.issuedBy,
          template.textAreas.issuedBy.x,
          template.textAreas.issuedBy.y + template.textAreas.issuedBy.fontSize * sizeMultiplier,
          template.textAreas.issuedBy.fontSize * sizeMultiplier,
          options.textColor || template.textAreas.issuedBy.color,
          template.textAreas.issuedBy.fontFamily,
          'start'
        )}
      </svg>
    `;

    // Start with template image
    let image = templateImage;

    // Add SVG overlay
    image = image.composite([
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0
      }
    ]);

    // Add QR code if requested
    if (options.includeQRCode && template.textAreas.qrCode) {
      try {
        const qrCodeBuffer = await generateQRCode(data, options.qrCodeColor);
        const qrSize = template.textAreas.qrCode.size;
        
        image = image.composite([
          {
            input: qrCodeBuffer,
            top: template.textAreas.qrCode.y,
            left: template.textAreas.qrCode.x
          }
        ]);

        // Add verification text below QR code
        const qrTextSVG = `
          <svg width="${qrSize}" height="30" xmlns="http://www.w3.org/2000/svg">
            <text x="${qrSize / 2}" y="20" font-family="Arial" font-size="12" fill="${options.textColor || '#7f8c8d'}" text-anchor="middle">Scan to verify</text>
          </svg>
        `;

        image = image.composite([
          {
            input: Buffer.from(qrTextSVG),
            top: template.textAreas.qrCode.y + qrSize + 5,
            left: template.textAreas.qrCode.x
          }
        ]);
      } catch (error) {
        console.warn('Failed to generate QR code:', error);
        // Continue without QR code
      }
    }

    // Convert to JPEG buffer
    return await image.jpeg({ quality: 95 }).toBuffer();

  } catch (error) {
    throw new Error(`Failed to generate template certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate template certificate and save to file
 */
export const generateTemplateCertificateFile = async (
  data: ICertificateData,
  options: ITemplateCertificateOptions = {},
  outputPath: string
): Promise<void> => {
  const certificateBuffer = await generateTemplateCertificate(data, options);
  fs.writeFileSync(outputPath, certificateBuffer);
};

/**
 * Generate template certificate for streaming response
 */
export const generateStreamingTemplateCertificate = async (
  data: ICertificateData,
  options: ITemplateCertificateOptions = {},
  res: any
): Promise<void> => {
  try {
    const certificateBuffer = await generateTemplateCertificate(data, options);
    
    // Set response headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${data.userName.replace(/\s+/g, '-')}.jpg"`);
    res.setHeader('Content-Length', certificateBuffer.length);
    
    // Send the image
    res.send(certificateBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate template certificate' });
  }
};

/**
 * Validate template certificate options
 */
export const validateTemplateCertificateOptions = (options: ITemplateCertificateOptions): string[] => {
  const errors: string[] = [];

  if (options.templateId && !templateConfigs.find(t => t.id === options.templateId)) {
    errors.push(`Invalid template ID. Available templates: ${templateConfigs.map(t => t.id).join(', ')}`);
  }

  if (options.fontSize && !['small', 'medium', 'large'].includes(options.fontSize)) {
    errors.push('Invalid font size. Choose from: small, medium, large');
  }

  if (options.textColor && !/^#[0-9A-F]{6}$/i.test(options.textColor)) {
    errors.push('Invalid text color format. Use hex format (e.g., #2c3e50)');
  }

  if (options.qrCodeColor && !/^#[0-9A-F]{6}$/i.test(options.qrCodeColor)) {
    errors.push('Invalid QR code color format. Use hex format (e.g., #000000)');
  }

  return errors;
};
