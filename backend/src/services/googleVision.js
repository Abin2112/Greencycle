import vision from '@google-cloud/vision';
import { GoogleAuth } from 'google-auth-library';

class GoogleVisionService {
  constructor() {
    this.client = null;
    this.initializeClient();
  }

  async initializeClient() {
    try {
      // Option 1: Using Service Account (Recommended for Production)
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        this.client = new vision.ImageAnnotatorClient({
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
        });
      }
      // Option 2: Using API Key (Development)
      else if (process.env.GOOGLE_VISION_API_KEY) {
        const auth = new GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
          credentials: {
            type: 'service_account',
            project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
            private_key_id: process.env.GOOGLE_VISION_PRIVATE_KEY_ID,
            private_key: process.env.GOOGLE_VISION_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            client_email: process.env.GOOGLE_VISION_CLIENT_EMAIL,
            client_id: process.env.GOOGLE_VISION_CLIENT_ID,
            auth_uri: 'https://accounts.google.com/o/oauth2/auth',
            token_uri: 'https://oauth2.googleapis.com/token',
            auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs'
          }
        });

        this.client = new vision.ImageAnnotatorClient({ auth });
      } else {
        console.warn('Google Vision API credentials not configured. Using mock responses.');
        this.client = null;
      }
    } catch (error) {
      console.error('Failed to initialize Google Vision client:', error);
      this.client = null;
    }
  }

  // Device Recognition for E-waste
  async recognizeDevice(imageBuffer) {
    try {
      if (!this.client) {
        return this.getMockDeviceRecognition();
      }

      const [result] = await this.client.labelDetection({
        image: { content: imageBuffer }
      });

      const labels = result.labelAnnotations || [];
      
      // Extract device-related labels
      const deviceLabels = labels.filter(label => 
        this.isDeviceRelated(label.description.toLowerCase())
      );

      // Analyze device type
      const deviceType = this.determineDeviceType(deviceLabels);
      const condition = await this.assessCondition(imageBuffer);
      const brand = this.extractBrand(labels);

      return {
        success: true,
        deviceType,
        confidence: deviceLabels.length > 0 ? deviceLabels[0].score : 0.5,
        detectedLabels: deviceLabels.map(l => ({
          description: l.description,
          confidence: l.score
        })),
        suggestedBrand: brand,
        condition,
        estimatedValue: this.estimateValue(deviceType, condition),
        recyclableComponents: this.identifyComponents(deviceLabels),
        hazardousMaterials: this.identifyHazardousMaterials(deviceType)
      };

    } catch (error) {
      console.error('Device recognition error:', error);
      return this.getMockDeviceRecognition();
    }
  }

  // OCR Text Extraction
  async extractText(imageBuffer) {
    try {
      if (!this.client) {
        return this.getMockOCRResult();
      }

      const [result] = await this.client.textDetection({
        image: { content: imageBuffer }
      });

      const detections = result.textAnnotations || [];
      
      if (detections.length === 0) {
        return {
          success: false,
          message: 'No text detected in image'
        };
      }

      const fullText = detections[0].description;
      const extractedInfo = this.parseDeviceInfo(fullText);

      return {
        success: true,
        fullText,
        extractedInfo,
        confidence: 0.85,
        boundingBoxes: detections.slice(1).map(detection => ({
          text: detection.description,
          bounds: detection.boundingPoly
        }))
      };

    } catch (error) {
      console.error('OCR extraction error:', error);
      return this.getMockOCRResult();
    }
  }

  // Condition Assessment
  async assessCondition(imageBuffer) {
    try {
      if (!this.client) {
        return this.getMockConditionAssessment();
      }

      // Use object localization to detect damage
      const [result] = await this.client.objectLocalization({
        image: { content: imageBuffer }
      });

      const objects = result.localizedObjectAnnotations || [];
      
      // Analyze for damage indicators
      const damageIndicators = objects.filter(obj => 
        ['crack', 'scratch', 'dent', 'broken'].some(damage => 
          obj.name.toLowerCase().includes(damage)
        )
      );

      let condition = 'working';
      if (damageIndicators.length > 2) {
        condition = 'major_issues';
      } else if (damageIndicators.length > 0) {
        condition = 'minor_issues';
      }

      return {
        condition,
        confidence: 0.7,
        damageIndicators: damageIndicators.map(d => d.name),
        assessment: this.getConditionDescription(condition)
      };

    } catch (error) {
      console.error('Condition assessment error:', error);
      return this.getMockConditionAssessment();
    }
  }

  // Helper Methods
  isDeviceRelated(label) {
    const deviceKeywords = [
      'smartphone', 'phone', 'mobile', 'iphone', 'android',
      'laptop', 'computer', 'notebook', 'macbook',
      'tablet', 'ipad',
      'television', 'tv', 'monitor', 'screen', 'display',
      'refrigerator', 'fridge', 'appliance',
      'washing machine', 'washer',
      'microwave', 'oven',
      'printer', 'scanner',
      'camera', 'electronic', 'device', 'gadget',
      'speaker', 'headphone', 'audio',
      'router', 'modem', 'network',
      'gaming', 'console', 'playstation', 'xbox'
    ];

    return deviceKeywords.some(keyword => label.includes(keyword));
  }

  determineDeviceType(labels) {
    const typeMapping = {
      'smartphone': ['phone', 'mobile', 'iphone', 'android', 'smartphone'],
      'laptop': ['laptop', 'notebook', 'computer', 'macbook'],
      'tablet': ['tablet', 'ipad'],
      'television': ['television', 'tv', 'monitor'],
      'refrigerator': ['refrigerator', 'fridge'],
      'washing_machine': ['washing machine', 'washer'],
      'microwave': ['microwave', 'oven'],
      'printer': ['printer', 'scanner'],
      'camera': ['camera'],
      'speaker': ['speaker', 'audio'],
      'gaming_console': ['gaming', 'console', 'playstation', 'xbox']
    };

    for (const [type, keywords] of Object.entries(typeMapping)) {
      for (const label of labels) {
        if (keywords.some(keyword => 
          label.description.toLowerCase().includes(keyword)
        )) {
          return type;
        }
      }
    }

    return 'other_electronics';
  }

  extractBrand(labels) {
    const brands = [
      'apple', 'samsung', 'google', 'lg', 'sony', 'hp', 'dell', 
      'lenovo', 'asus', 'acer', 'microsoft', 'huawei', 'xiaomi',
      'oneplus', 'nokia', 'motorola', 'oppo', 'vivo', 'realme'
    ];

    for (const label of labels) {
      const description = label.description.toLowerCase();
      for (const brand of brands) {
        if (description.includes(brand)) {
          return brand.charAt(0).toUpperCase() + brand.slice(1);
        }
      }
    }

    return null;
  }

  estimateValue(deviceType, condition) {
    const baseValues = {
      smartphone: 200,
      laptop: 500,
      tablet: 300,
      television: 400,
      refrigerator: 600,
      washing_machine: 500,
      microwave: 150,
      printer: 100,
      camera: 250,
      speaker: 80,
      gaming_console: 300,
      other_electronics: 50
    };

    const conditionMultipliers = {
      working: 1.0,
      minor_issues: 0.7,
      major_issues: 0.4,
      non_working: 0.2
    };

    const baseValue = baseValues[deviceType] || baseValues.other_electronics;
    const multiplier = conditionMultipliers[condition] || 0.5;

    return Math.floor(baseValue * multiplier);
  }

  identifyComponents(labels) {
    const components = ['battery', 'screen', 'circuit_board', 'metal_frame', 'plastic_casing'];
    return components; // In real implementation, analyze labels for specific components
  }

  identifyHazardousMaterials(deviceType) {
    const hazardousMap = {
      smartphone: ['lithium battery', 'rare earth metals'],
      laptop: ['lithium battery', 'mercury (in older models)', 'lead'],
      television: ['mercury', 'lead', 'cadmium'],
      refrigerator: ['refrigerants', 'foam blowing agents'],
      default: ['general electronic waste']
    };

    return hazardousMap[deviceType] || hazardousMap.default;
  }

  parseDeviceInfo(text) {
    const info = {
      model: null,
      serialNumber: null,
      brand: null,
      manufactureDate: null
    };

    // Extract model numbers (pattern: letters followed by numbers and hyphens)
    const modelMatch = text.match(/Model:?\s*([A-Z0-9\-]+)/i);
    if (modelMatch) info.model = modelMatch[1];

    // Extract serial numbers
    const serialMatch = text.match(/Serial:?\s*([A-Z0-9]+)/i) || 
                       text.match(/S\/N:?\s*([A-Z0-9]+)/i);
    if (serialMatch) info.serialNumber = serialMatch[1];

    // Extract manufacture date
    const dateMatch = text.match(/(\d{4})/);
    if (dateMatch) info.manufactureDate = dateMatch[1];

    return info;
  }

  getConditionDescription(condition) {
    const descriptions = {
      working: 'Device appears to be in good working condition',
      minor_issues: 'Device shows minor wear or damage but likely functional',
      major_issues: 'Device has significant damage, may not be fully functional',
      non_working: 'Device appears to be severely damaged or non-functional'
    };

    return descriptions[condition] || 'Condition could not be determined';
  }

  // Mock responses for development/fallback
  getMockDeviceRecognition() {
    const deviceTypes = ['smartphone', 'laptop', 'tablet', 'television'];
    const brands = ['Apple', 'Samsung', 'LG', 'Sony', 'HP'];
    const conditions = ['working', 'minor_issues', 'major_issues'];

    const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      success: true,
      deviceType,
      confidence: 0.75 + Math.random() * 0.25,
      detectedLabels: [
        { description: deviceType, confidence: 0.9 },
        { description: 'electronics', confidence: 0.8 }
      ],
      suggestedBrand: brands[Math.floor(Math.random() * brands.length)],
      condition,
      estimatedValue: this.estimateValue(deviceType, condition),
      recyclableComponents: ['battery', 'screen', 'circuit_board', 'metal_frame'],
      hazardousMaterials: this.identifyHazardousMaterials(deviceType)
    };
  }

  getMockOCRResult() {
    return {
      success: true,
      fullText: 'Model: ABC-123\nSerial: XYZ789\nManufactured: 2020',
      extractedInfo: {
        model: 'ABC-123',
        serialNumber: 'XYZ789',
        brand: null,
        manufactureDate: '2020'
      },
      confidence: 0.85,
      boundingBoxes: []
    };
  }

  getMockConditionAssessment() {
    const conditions = ['working', 'minor_issues', 'major_issues'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      condition,
      confidence: 0.7,
      damageIndicators: condition !== 'working' ? ['minor scratches'] : [],
      assessment: this.getConditionDescription(condition)
    };
  }
}

export default new GoogleVisionService();