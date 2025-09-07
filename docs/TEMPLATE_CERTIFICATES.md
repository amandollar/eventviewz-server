# Template-Based Certificate Generation

## Overview

The EventViewz backend now supports template-based certificate generation using your custom template images. This system overlays text on predefined template images to create professional-looking certificates.

## Features

- **Template-based Generation**: Use your custom template images as backgrounds
- **Text Overlay**: Automatically position and style text on templates
- **QR Code Support**: Add verification QR codes to certificates
- **Customizable Styling**: Control fonts, colors, and text positioning
- **Multiple Templates**: Support for multiple template designs
- **Backward Compatibility**: Original PDF generation still available

## Template System

### Template Structure

Templates are stored in the `template/` folder and configured in the system:

```
template/
├── Template1.jpeg  # Classic template
└── Template2.jpeg  # Modern template
```

### Template Configuration

Each template has predefined text areas for:
- **Title**: "CERTIFICATE OF COMPLETION"
- **User Name**: Participant's name
- **Event Title**: Event name
- **Date**: Event date
- **Venue**: Event location
- **Issued By**: Manager/issuer name
- **QR Code**: Optional verification code

## API Endpoints

### Template Management

#### Get Available Templates
```http
GET /api/v1/certificates/templates
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "templates": [
    {
      "id": "template1",
      "name": "Classic Template",
      "filename": "Template1.jpeg",
      "available": true
    },
    {
      "id": "template2", 
      "name": "Modern Template",
      "filename": "Template2.jpeg",
      "available": true
    }
  ],
  "defaultOptions": {
    "templateId": "template1",
    "includeQRCode": false,
    "fontSize": "medium",
    "customText": {
      "title": "CERTIFICATE OF COMPLETION",
      "greeting": "This is to certify that",
      "completionText": "has successfully completed"
    }
  }
}
```

### Certificate Generation

#### Generate Template Certificate (Manager)
```http
POST /api/v1/certificates/template/:registrationId
Authorization: Bearer <token>
Content-Type: application/json

{
  "templateId": "template1",
  "includeQRCode": true,
  "customText": {
    "title": "CERTIFICATE OF COMPLETION",
    "greeting": "This is to certify that",
    "completionText": "has successfully completed"
  },
  "fontSize": "medium",
  "textColor": "#2c3e50",
  "qrCodeColor": "#000000"
}
```

#### Generate Template Certificate (Student)
```http
POST /api/v1/certificates/student/template/:registrationId
Authorization: Bearer <token>
Content-Type: application/json

{
  "templateId": "template1"
}
```

## Configuration Options

### Template Certificate Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `templateId` | string | Template to use (template1, template2) | "template1" |
| `includeQRCode` | boolean | Include QR code for verification | false |
| `customText` | object | Custom text overrides | {} |
| `fontSize` | string | Font size (small, medium, large) | "medium" |
| `textColor` | string | Text color (hex format) | Template default |
| `qrCodeColor` | string | QR code color (hex format) | "#000000" |

### Custom Text Options

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Certificate title |
| `greeting` | string | Greeting text before name |
| `completionText` | string | Text after name |

## Template Configuration

### Adding New Templates

1. **Add Template Image**: Place your template image in the `template/` folder
2. **Configure Text Areas**: Update `templateConfigs` in `templateCertificateGenerator.ts`
3. **Define Positioning**: Set x, y coordinates and dimensions for each text area

Example configuration:
```typescript
{
  id: 'template3',
  name: 'Custom Template',
  filename: 'Template3.jpeg',
  textAreas: {
    title: { x: 400, y: 150, width: 400, height: 60, fontSize: 48, color: '#2c3e50', fontFamily: 'Arial Bold' },
    userName: { x: 400, y: 250, width: 400, height: 80, fontSize: 36, color: '#2c3e50', fontFamily: 'Arial Bold' },
    // ... other text areas
  }
}
```

## Dependencies

The template system requires this additional dependency:

```json
{
  "sharp": "^0.33.0"
}
```

## Installation

1. **Install Dependencies**:
   ```bash
   npm install sharp
   ```

2. **Rebuild Server**:
   ```bash
   npm run build
   npm start
   ```

## Windows Compatibility

This implementation uses Sharp with SVG overlays instead of Canvas, making it fully compatible with Windows without requiring Visual Studio build tools or native compilation.

## Usage Examples

### Frontend Integration

```javascript
// Get available templates
const templates = await fetch('/api/v1/certificates/templates', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(res => res.json());

// Generate certificate with template
const certificate = await fetch(`/api/v1/certificates/template/${registrationId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    templateId: 'template1',
    includeQRCode: true,
    fontSize: 'large',
    textColor: '#2c3e50'
  })
});
```

### Manager Dashboard

```javascript
// Generate certificate for attended participant
const generateCertificate = async (registrationId, templateId) => {
  const response = await fetch(`/api/v1/certificates/template/${registrationId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${managerToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      templateId,
      includeQRCode: true,
      customText: {
        title: 'CERTIFICATE OF EXCELLENCE',
        greeting: 'We are proud to present this certificate to',
        completionText: 'for outstanding participation in'
      }
    })
  });
  
  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificate.jpg';
    a.click();
  }
};
```

## Error Handling

The system handles various error scenarios:

- **Template Not Found**: Returns 400 error with available templates
- **Invalid Options**: Validates input and returns specific error messages
- **File System Errors**: Handles missing template files gracefully
- **Image Processing Errors**: Falls back to PDF generation if template processing fails

## Performance Considerations

- **Image Caching**: Templates are loaded and cached for better performance
- **Streaming Response**: Large certificates are streamed to avoid memory issues
- **Error Recovery**: System falls back to PDF generation if template processing fails
- **Memory Management**: Canvas objects are properly disposed after use

## Security

- **Authentication Required**: All endpoints require valid authentication
- **Role-based Access**: Manager endpoints require admin/organizer roles
- **Input Validation**: All inputs are validated using Zod schemas
- **File Path Security**: Template paths are validated to prevent directory traversal

## Troubleshooting

### Common Issues

1. **Sharp Installation Issues**:
   ```bash
   # If Sharp fails to install, try:
   npm install --platform=win32 --arch=x64 sharp
   # or
   npm install sharp --force
   ```

2. **Template Not Loading**:
   - Check file exists in `template/` folder
   - Verify file permissions
   - Check file format (JPEG/PNG supported)

3. **Text Positioning Issues**:
   - Verify template configuration coordinates
   - Check image dimensions match template config
   - Test with different font sizes

4. **SVG Rendering Issues**:
   - Ensure SVG text elements are properly formatted
   - Check font family names are valid
   - Verify color values are in hex format

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=template-certificate
```

## Migration from PDF Certificates

The system maintains backward compatibility:

- **Existing PDF endpoints** continue to work
- **New template endpoints** provide enhanced functionality
- **Gradual migration** - switch endpoints as needed
- **Fallback support** - template system falls back to PDF if needed

## Future Enhancements

- **Dynamic Template Upload**: Upload new templates via API
- **Template Editor**: Web-based template configuration tool
- **Batch Generation**: Generate multiple certificates at once
- **Custom Fonts**: Support for custom font uploads
- **Watermarking**: Add watermarks to certificates
- **Digital Signatures**: Add digital signature support
