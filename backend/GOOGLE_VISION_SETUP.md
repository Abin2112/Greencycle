# Google Vision API Setup Guide for GreenCycle

## 🔑 API Key Setup (Recommended for Development)

### Step 1: Enable Vision API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `glowing-program-472106-r8`
3. Navigate to **APIs & Services** → **Library**
4. Search for "Vision API" and click **Enable** ✅ (You've already done this)

### Step 2: Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. Copy the generated API key
4. **Important**: Restrict the API key for security:
   - Click the pencil icon to edit your API key
   - Under **API restrictions**, select "Restrict key"
   - Choose "Cloud Vision API" from the dropdown
   - Under **Application restrictions**, choose "HTTP referrers" or "IP addresses" based on your needs

### Step 3: Update Your .env File
Replace `your-actual-api-key-here` with your real API key:

```env
GOOGLE_VISION_API_KEY=AIzaSyYourActualApiKeyHere123456789
```

## 🔐 Service Account Setup (Recommended for Production)

### Step 1: Create Service Account
1. Go to **IAM & Admin** → **Service Accounts**
2. Click **+ CREATE SERVICE ACCOUNT**
3. Name: `greencycle-vision-service`
4. Description: `Service account for GreenCycle Vision API`
5. Click **CREATE AND CONTINUE**

### Step 2: Assign Roles
1. Add role: **Cloud Vision API Service Agent**
2. Add role: **Service Account User**
3. Click **CONTINUE** → **DONE**

### Step 3: Generate Key
1. Click on your newly created service account
2. Go to **Keys** tab
3. Click **ADD KEY** → **Create new key**
4. Choose **JSON** format
5. Download the JSON file

### Step 4: Configure Environment
1. Place the JSON file in your project: `backend/config/google-service-account.json`
2. Update your .env file:

```env
# Service Account Method (More Secure)
GOOGLE_APPLICATION_CREDENTIALS=./config/google-service-account.json
GOOGLE_CLOUD_PROJECT_ID=glowing-program-472106-r8
```

## 📋 Current Configuration Status

Your current `.env` file has:
```env
GOOGLE_VISION_API_KEY=your-actual-api-key-here
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

## ⚙️ Which Method Should You Use?

### For Development/Testing: **API Key Method**
✅ **Pros:**
- Simple setup
- Quick to implement
- Good for testing

❌ **Cons:**
- Less secure
- Rate limits per key
- Harder to manage permissions

**Setup:**
1. Create API key from Google Cloud Console
2. Add to .env: `GOOGLE_VISION_API_KEY=your-key-here`
3. Update project ID: `GOOGLE_CLOUD_PROJECT_ID=glowing-program-472106-r8`

### For Production: **Service Account Method**
✅ **Pros:**
- More secure
- Fine-grained permissions
- Better for production
- Easier to rotate credentials

❌ **Cons:**
- More complex setup
- Requires JSON file management

**Setup:**
1. Create service account and download JSON
2. Add to .env: `GOOGLE_APPLICATION_CREDENTIALS=./config/google-service-account.json`
3. Update project ID: `GOOGLE_CLOUD_PROJECT_ID=glowing-program-472106-r8`

## 🧪 Testing Your Setup

Once configured, test the Vision API integration:

1. **Start your server:**
```bash
npm start
```

2. **Upload a device image** via the API:
```bash
curl -X POST http://localhost:3001/api/devices/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "device_type=smartphone" \
  -F "condition=working" \
  -F "images=@path/to/device-image.jpg"
```

3. **Check the response** for AI analysis results:
```json
{
  "success": true,
  "message": "Device uploaded successfully with AI analysis",
  "data": {
    "ai_analysis": {
      "device_recognition": {
        "deviceType": "smartphone",
        "confidence": 0.95,
        "suggestedBrand": "Apple",
        "condition": "working"
      }
    }
  }
}
```

## 🔧 Features Enabled with Google Vision API

### 🤖 **Device Recognition**
- Automatic device type detection (smartphone, laptop, etc.)
- Brand recognition from images
- Condition assessment based on visual damage
- Component identification (battery, screen, etc.)

### 📝 **OCR Text Extraction**
- Serial number extraction
- Model number detection  
- Manufacturing date identification
- Barcode/QR code reading

### 💰 **Smart Valuation**
- AI-powered device value estimation
- Condition-based price adjustments
- Market data integration

### ♻️ **Environmental Impact**
- Hazardous material detection
- Recyclable component identification
- Disposal recommendations

## 🚨 Important Security Notes

1. **Never commit API keys or service account files to version control**
2. **Use environment variables for all credentials**
3. **Restrict API keys to specific APIs and domains**
4. **Regularly rotate service account keys**
5. **Monitor API usage and costs**

## 💡 Next Steps

1. **Choose your authentication method** (API Key or Service Account)
2. **Update your .env file** with real credentials
3. **Test the integration** with a device upload
4. **Monitor usage** in Google Cloud Console
5. **Set up billing alerts** to avoid unexpected charges

Your GreenCycle platform now has powerful AI capabilities for automated e-waste device recognition! 🌱📱