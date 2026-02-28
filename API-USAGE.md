# API Usage Guide

## 📋 Centralized API Configuration

Your Next.js application now uses a centralized API configuration located at `lib/api-config.ts`. This provides:

- ✅ Environment-based API URLs
- ✅ Proper error handling
- ✅ Request/response interceptors
- ✅ File upload/download utilities
- ✅ Health check functionality

## 🚀 How to Use

### Basic API Call

```typescript
import { apiClient } from '@/lib/api-config';

// GET request
export const getData = async () => {
  try {
    const response = await apiClient.get('/api/endpoint');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// POST request
export const postData = async (data: any) => {
  try {
    const response = await apiClient.post('/api/endpoint', data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

### File Upload Example

```typescript
import { uploadFile } from '@/lib/api-config';

export const uploadPdf = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await uploadFile('/api/upload', formData);
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
```

### File Download Example

```typescript
import { downloadFile } from '@/lib/api-config';

export const downloadPdf = async (fileId: string) => {
  try {
    const response = await downloadFile(`/api/download/${fileId}`);
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `file-${fileId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};
```

## 🔧 Environment Configuration

### Local Development (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=your_local_api_key
```

### Production (Vercel Environment Variables)
```bash
NEXT_PUBLIC_API_URL=https://taj-pdf-docs-backend.onrender.com
NEXT_PUBLIC_BACKEND_URL=https://taj-pdf-docs-backend.onrender.com
NEXT_PUBLIC_API_KEY=your_production_api_key
```

## 🚨 Error Handling

The API client automatically handles:

- **401 Unauthorized**: API key issues
- **404 Not Found**: Backend deployment issues  
- **5xx Server Errors**: Backend service problems
- **Timeouts**: Long-running requests

```typescript
// Error response format
{
  message: "Descriptive error message",
  status: 404,
  data: { /* original error data */ }
}
```

## 🧪 Health Checking

```typescript
import { checkApiHealth } from '@/lib/api-config';

// Check if backend is available
const isBackendHealthy = await checkApiHealth();
if (!isBackendHealthy) {
  // Show maintenance message or fallback UI
}
```

## 🔍 Debugging

Enable debug logging by setting:
```bash
NODE_ENV=development
```

This will log all API requests and responses to the console.

## 📋 Production Checklist

- [ ] Set `NEXT_PUBLIC_API_URL` in Vercel environment variables
- [ ] Set `NEXT_PUBLIC_API_KEY` in Vercel environment variables  
- [ ] Test API calls from production environment
- [ ] Verify file upload/download functionality
- [ ] Confirm error handling works correctly
- [ ] Test health check endpoint

## 🚀 Deployment

1. **Vercel Dashboard** → Your Project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_API_URL` = `https://taj-pdf-docs-backend.onrender.com`
   - `NEXT_PUBLIC_API_KEY` = Your production API key
3. Redeploy application

## 🔒 Security Notes

- Never commit actual API keys to version control
- Use different keys for development and production  
- Rotate API keys regularly
- Monitor API usage and errors