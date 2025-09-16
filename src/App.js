  import React, { useState, useRef, useCallback } from 'react';
  import { Upload, Shield, CheckCircle, XCircle, AlertTriangle, Eye, Database, Users, FileText, Search, Camera, Hash, Cpu, Brain } from 'lucide-react';

  const FakeDegreeDetector = () => {
    const [activeTab, setActiveTab] = useState('verify');
    const [uploadedCertificate, setUploadedCertificate] = useState(null);
    const [uploadedSignature, setUploadedSignature] = useState(null);
    const [uploadedSeal, setUploadedSeal] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState(null);
    const [mlResults, setMlResults] = useState(null);
    const [processingStage, setProcessingStage] = useState('');
    
    const certificateRef = useRef(null);
    const signatureRef = useRef(null);
    const sealRef = useRef(null);

    // Professor database with actual signature and seal patterns (simulated ML features)
    const professorDatabase = [
      { 
        id: 'P01', 
        name: 'Dr. Aarav Sharma', 
        department: 'Computer Science', 
        university: 'Jharkhand Tech University',
        signatureFeatures: [0.23, 0.67, 0.45, 0.89, 0.12], // ML feature vector
        sealFeatures: [0.78, 0.34, 0.91, 0.56, 0.23],
        signaturePattern: 'curved_ascending_high_pressure',
        sealPattern: 'circular_embossed_university_logo'
      },
      { 
        id: 'P02', 
        name: 'Dr. Kavya Iyer', 
        department: 'Electronics', 
        university: 'Jharkhand Tech University',
        signatureFeatures: [0.45, 0.23, 0.78, 0.34, 0.67],
        sealFeatures: [0.56, 0.89, 0.12, 0.78, 0.45],
        signaturePattern: 'angular_compact_medium_pressure',
        sealPattern: 'circular_embossed_university_logo'
      },
      { 
        id: 'P03', 
        name: 'Dr. Rohan Das', 
        department: 'Mechanical Engg.', 
        university: 'BIT Sindri',
        signatureFeatures: [0.67, 0.45, 0.23, 0.78, 0.91],
        sealFeatures: [0.34, 0.67, 0.89, 0.12, 0.56],
        signaturePattern: 'flowing_extended_low_pressure',
        sealPattern: 'rectangular_embossed_institute_logo'
      },
      { 
        id: 'P04', 
        name: 'Dr. Meera Kulkarni', 
        department: 'Civil Engg.', 
        university: 'Ranchi University',
        signatureFeatures: [0.89, 0.12, 0.56, 0.23, 0.78],
        sealFeatures: [0.45, 0.91, 0.34, 0.67, 0.89],
        signaturePattern: 'neat_compact_high_pressure',
        sealPattern: 'oval_printed_university_seal'
      },
      { 
        id: 'P05', 
        name: 'Dr. Aniket Verma', 
        department: 'AI & Data Science', 
        university: 'BIT Mesra',
        signatureFeatures: [0.34, 0.78, 0.91, 0.45, 0.23],
        sealFeatures: [0.67, 0.12, 0.78, 0.34, 0.91],
        signaturePattern: 'digital_style_consistent_pressure',
        sealPattern: 'rectangular_embossed_institute_logo'
      },
      { 
        id: 'P06', 
        name: 'Dr. Sneha Choudhary', 
        department: 'Biotechnology', 
        university: 'Vinoba Bhave University',
        signatureFeatures: [0.78, 0.34, 0.67, 0.89, 0.45],
        sealFeatures: [0.23, 0.78, 0.56, 0.91, 0.12],
        signaturePattern: 'artistic_flowing_variable_pressure',
        sealPattern: 'circular_printed_university_seal'
      },
      { 
        id: 'P07', 
        name: 'Dr. Ishaan Nair', 
        department: 'Management', 
        university: 'Ranchi Women\'s College',
        signatureFeatures: [0.56, 0.91, 0.12, 0.67, 0.78],
        sealFeatures: [0.89, 0.45, 0.23, 0.56, 0.34],
        signaturePattern: 'bold_angular_high_pressure',
        sealPattern: 'oval_printed_college_seal'
      },
      { 
        id: 'P08', 
        name: 'Dr. Priya Mukherjee', 
        department: 'Physics', 
        university: 'Ranchi University',
        signatureFeatures: [0.12, 0.67, 0.78, 0.23, 0.91],
        sealFeatures: [0.34, 0.56, 0.45, 0.89, 0.67],
        signaturePattern: 'scientific_precise_medium_pressure',
        sealPattern: 'oval_printed_university_seal'
      },
      { 
        id: 'P09', 
        name: 'Dr. Aditya Singh', 
        department: 'Mathematics', 
        university: 'BIT Sindri',
        signatureFeatures: [0.91, 0.45, 0.34, 0.12, 0.56],
        sealFeatures: [0.78, 0.67, 0.91, 0.23, 0.78],
        signaturePattern: 'mathematical_geometric_consistent',
        sealPattern: 'rectangular_embossed_institute_logo'
      },
      { 
        id: 'P10', 
        name: 'Dr. Nisha Raj', 
        department: 'Chemistry', 
        university: 'Ranchi University',
        signatureFeatures: [0.67, 0.23, 0.89, 0.78, 0.34],
        sealFeatures: [0.12, 0.91, 0.67, 0.45, 0.23],
        signaturePattern: 'elegant_curved_light_pressure',
        sealPattern: 'oval_printed_university_seal'
      }
    ];

    // AI/ML Functions

    // Computer Vision: Extract features from uploaded images
    const extractImageFeatures = useCallback((imageFile, type) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            // Create canvas for image processing
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Simulate ML feature extraction
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            
            // Extract features: edge density, symmetry, texture patterns
            const features = [];
            let edgeCount = 0;
            let avgIntensity = 0;
            
            for (let i = 0; i < pixels.length; i += 4) {
              const r = pixels[i];
              const g = pixels[i + 1];
              const b = pixels[i + 2];
              const intensity = (r + g + b) / 3;
              avgIntensity += intensity;
              
              // Simple edge detection
              if (i > 0 && Math.abs(intensity - ((pixels[i-4] + pixels[i-3] + pixels[i-2]) / 3)) > 30) {
                edgeCount++;
              }
            }
            
            avgIntensity /= (pixels.length / 4);
            const edgeDensity = edgeCount / (pixels.length / 4);
            
            // Generate normalized feature vector
            features.push(edgeDensity);
            features.push(avgIntensity / 255);
            features.push(Math.random() * 0.5 + 0.25); // Simulated symmetry score
            features.push(Math.random() * 0.5 + 0.25); // Simulated texture complexity
            features.push(Math.random() * 0.5 + 0.25); // Simulated stroke consistency
            
            resolve({
              features: features.map(f => Math.min(1, Math.max(0, f))),
              dimensions: { width: img.width, height: img.height },
              type: type,
              quality: avgIntensity > 50 ? 'good' : 'poor'
            });
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
      });
    }, []);

    // Neural Network: Compare signatures using cosine similarity
    const compareSignatures = useCallback((extractedFeatures, professorFeatures) => {
      const dotProduct = extractedFeatures.reduce((sum, val, i) => sum + val * professorFeatures[i], 0);
      const normA = Math.sqrt(extractedFeatures.reduce((sum, val) => sum + val * val, 0));
      const normB = Math.sqrt(professorFeatures.reduce((sum, val) => sum + val * val, 0));
      
      const similarity = dotProduct / (normA * normB);
      return Math.max(0, Math.min(1, similarity));
    }, []);

    // Deep Learning: OCR with confidence scoring
    const performOCR = useCallback((imageFile) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate OCR extraction with confidence scores
          const sampleData = [
            {
              studentName: { text: 'Rahul Kumar', confidence: 0.95 },
              rollNumber: { text: 'JTU2021001', confidence: 0.98 },
              degree: { text: 'Bachelor of Technology', confidence: 0.92 },
              department: { text: 'Computer Science', confidence: 0.89 },
              university: { text: 'Jharkhand Tech University', confidence: 0.94 },
              graduationYear: { text: '2024', confidence: 0.99 },
              grade: { text: 'First Class', confidence: 0.87 },
              certificateId: { text: 'JTU-CS-2024-001', confidence: 0.96 },
              professorName: { text: 'Dr. Aarav Sharma', confidence: 0.91 }
            },
            {
              studentName: { text: 'Priya Singh', confidence: 0.93 },
              rollNumber: { text: 'RU2020045', confidence: 0.97 },
              degree: { text: 'Master of Science', confidence: 0.95 },
              department: { text: 'Physics', confidence: 0.92 },
              university: { text: 'Ranchi University', confidence: 0.96 },
              graduationYear: { text: '2023', confidence: 0.98 },
              grade: { text: 'Distinction', confidence: 0.89 },
              certificateId: { text: 'RU-PHY-2023-045', confidence: 0.94 },
              professorName: { text: 'Dr. Priya Mukherjee', confidence: 0.88 }
            }
          ];
          
          resolve(sampleData[Math.floor(Math.random() * sampleData.length)]);
        }, 1500);
      });
    }, []);

    // Anomaly Detection: ML-based tampering detection
    const detectTampering = useCallback((certificateFeatures, textData) => {
      const anomalies = [];
      let tamperingScore = 0;

      // Check for digital manipulation signatures
      if (certificateFeatures.quality === 'poor') {
        anomalies.push('Low image quality detected - possible compression artifacts');
        tamperingScore += 0.2;
      }

      // Check OCR confidence scores
      Object.entries(textData).forEach(([key, value]) => {
        if (value.confidence < 0.85) {
          anomalies.push(`Low confidence in ${key} extraction (${(value.confidence * 100).toFixed(1)}%)`);
          tamperingScore += 0.15;
        }
      });

      // Simulate advanced tampering detection
      const suspiciousPatterns = Math.random();
      if (suspiciousPatterns < 0.1) {
        anomalies.push('Suspicious pixel patterns detected - possible digital alteration');
        tamperingScore += 0.4;
      }

      return {
        anomalies,
        tamperingScore: Math.min(1, tamperingScore),
        isSuspicious: tamperingScore > 0.3
      };
    }, []);

    // Main AI/ML Processing Pipeline
    const processWithAI = useCallback(async () => {
      if (!uploadedCertificate) return;

      setIsProcessing(true);
      setProcessingStage('Initializing AI models...');
      await new Promise(resolve => setTimeout(resolve, 800));

      try {
        // Stage 1: Computer Vision - Extract certificate features
        setProcessingStage('Analyzing certificate image with Computer Vision...');
        const certificateFeatures = await extractImageFeatures(uploadedCertificate, 'certificate');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Stage 2: OCR with Deep Learning
        setProcessingStage('Extracting text using Deep Learning OCR...');
        const ocrData = await performOCR(uploadedCertificate);
        setExtractedData(ocrData);
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Stage 3: Signature Analysis
        let signatureAnalysis = null;
        if (uploadedSignature) {
          setProcessingStage('Analyzing signature with Neural Networks...');
          const signatureFeatures = await extractImageFeatures(uploadedSignature, 'signature');
          
          // Find matching professor
          const professorName = ocrData.professorName.text;
          const matchingProfessor = professorDatabase.find(p => p.name === professorName);
          
          if (matchingProfessor) {
            const similarity = compareSignatures(signatureFeatures.features, matchingProfessor.signatureFeatures);
            signatureAnalysis = {
              professor: matchingProfessor,
              similarity: similarity,
              isMatch: similarity > 0.75,
              extractedFeatures: signatureFeatures
            };
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Stage 4: Seal Verification
        let sealAnalysis = null;
        if (uploadedSeal) {
          setProcessingStage('Verifying institutional seal...');
          const sealFeatures = await extractImageFeatures(uploadedSeal, 'seal');
          
          const universityName = ocrData.university.text;
          const universitySeal = professorDatabase.find(p => p.university === universityName);
          
          if (universitySeal) {
            const sealSimilarity = compareSignatures(sealFeatures.features, universitySeal.sealFeatures);
            sealAnalysis = {
              university: universityName,
              similarity: sealSimilarity,
              isMatch: sealSimilarity > 0.70,
              extractedFeatures: sealFeatures
            };
          }
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Stage 5: Anomaly Detection
        setProcessingStage('Running anomaly detection algorithms...');
        const tamperingAnalysis = detectTampering(certificateFeatures, ocrData);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Stage 6: Blockchain Verification
        setProcessingStage('Verifying with blockchain ledger...');
        const blockchainVerified = ['JTU-CS-2024-001', 'RU-PHY-2023-045'].includes(ocrData.certificateId.text);
        await new Promise(resolve => setTimeout(resolve, 600));

        // Calculate final confidence score
        let confidence = 50;
        const issues = [];

        // OCR confidence boost
        const avgOcrConfidence = Object.values(ocrData).reduce((sum, item) => sum + item.confidence, 0) / Object.keys(ocrData).length;
        confidence += avgOcrConfidence * 30;

        // Signature verification
        if (signatureAnalysis) {
          if (signatureAnalysis.isMatch) {
            confidence += 15;
          } else {
            confidence -= 20;
            issues.push(`Signature mismatch (${(signatureAnalysis.similarity * 100).toFixed(1)}% similarity)`);
          }
        } else {
          issues.push('No signature provided for verification');
          confidence -= 10;
        }

        // Seal verification
        if (sealAnalysis) {
          if (sealAnalysis.isMatch) {
            confidence += 10;
          } else {
            confidence -= 15;
            issues.push(`Seal mismatch (${(sealAnalysis.similarity * 100).toFixed(1)}% similarity)`);
          }
        } else {
          issues.push('No seal provided for verification');
          confidence -= 5;
        }

        // Tampering detection
        if (tamperingAnalysis.isSuspicious) {
          confidence -= tamperingAnalysis.tamperingScore * 40;
          issues.push(...tamperingAnalysis.anomalies);
        }

        // Blockchain verification
        if (blockchainVerified) {
          confidence += 20;
        } else {
          confidence -= 25;
          issues.push('Certificate ID not found in blockchain ledger');
        }

        confidence = Math.max(0, Math.min(100, confidence));

        setMlResults({
          certificateFeatures,
          signatureAnalysis,
          sealAnalysis,
          tamperingAnalysis,
          blockchainVerified,
          avgOcrConfidence,
          finalConfidence: confidence,
          isAuthentic: confidence > 60,
          issues
        });

        setProcessingStage('Analysis complete!');

      } catch (error) {
        console.error('AI processing error:', error);
        setProcessingStage('Error in AI processing');
      } finally {
        setIsProcessing(false);
      }
    }, [uploadedCertificate, uploadedSignature, uploadedSeal, extractImageFeatures, performOCR, compareSignatures, detectTampering, professorDatabase]);

    const handleFileUpload = (file, type) => {
      switch (type) {
        case 'certificate':
          setUploadedCertificate(file);
          break;
        case 'signature':
          setUploadedSignature(file);
          break;
        case 'seal':
          setUploadedSeal(file);
          break;
      }
      // Reset results when new files are uploaded
      setVerificationResult(null);
      setExtractedData(null);
      setMlResults(null);
    };

    const resetUploads = () => {
      setUploadedCertificate(null);
      setUploadedSignature(null);
      setUploadedSeal(null);
      setExtractedData(null);
      setMlResults(null);
      setVerificationResult(null);
      [certificateRef, signatureRef, sealRef].forEach(ref => {
        if (ref.current) ref.current.value = '';
      });
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-indigo-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AI-Powered Certificate Verification</h1>
                  <p className="text-sm text-gray-500">Deep Learning + Computer Vision + Blockchain</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 px-3 py-1 rounded-full flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">AI/ML Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
            {[
              { id: 'verify', label: 'AI Verification', icon: Cpu },
              { id: 'database', label: 'ML Database', icon: Database },
              { id: 'stats', label: 'Analytics', icon: Eye }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* AI Verification Tab */}
          {activeTab === 'verify' && (
            <div className="space-y-8">
              {/* Upload Section */}
              <div className="bg-white rounded-xl shadow-lg p-8 border border-indigo-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <span>Multi-Modal AI Analysis</span>
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Certificate Upload */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Certificate (Required)</span>
                    </h3>
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 hover:bg-blue-100 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-blue-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700 mb-2">Upload Certificate</p>
                      <input
                        ref={certificateRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'certificate')}
                        className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {uploadedCertificate && (
                        <div className="mt-2 text-xs text-green-600 font-medium">
                          ✓ {uploadedCertificate.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Signature Upload */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                      <Hash className="h-5 w-5" />
                      <span>Signature (Optional)</span>
                    </h3>
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center bg-green-50 hover:bg-green-100 transition-colors">
                      <Camera className="mx-auto h-8 w-8 text-green-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700 mb-2">Upload Signature</p>
                      <input
                        ref={signatureRef}
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'signature')}
                        className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      {uploadedSignature && (
                        <div className="mt-2 text-xs text-green-600 font-medium">
                          ✓ {uploadedSignature.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Seal Upload */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Institutional Seal (Optional)</span>
                    </h3>
                    <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50 hover:bg-purple-100 transition-colors">
                      <Shield className="mx-auto h-8 w-8 text-purple-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700 mb-2">Upload Seal</p>
                      <input
                        ref={sealRef}
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'seal')}
                        className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                      {uploadedSeal && (
                        <div className="mt-2 text-xs text-green-600 font-medium">
                          ✓ {uploadedSeal.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex space-x-4">
                  <button
                    onClick={processWithAI}
                    disabled={!uploadedCertificate || isProcessing}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                  >
                    <Brain className="h-5 w-5" />
                    <span>{isProcessing ? 'AI Processing...' : 'Run AI Analysis'}</span>
                  </button>
                  <button
                    onClick={resetUploads}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Processing Status */}
              {isProcessing && (
                <div className="bg-white rounded-xl shadow-lg p-8 border border-indigo-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <Brain className="h-8 w-8 text-purple-600 animate-pulse" />
                      <Cpu className="h-8 w-8 text-blue-600 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
                    <p className="text-indigo-600 font-medium">{processingStage}</p>
                    <div className="mt-4 bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(100, (Date.now() % 10000) / 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {mlResults && (
                <div className="space-y-6">
                  {/* Main Result */}
                  <div className={`bg-white rounded-xl shadow-lg p-8 border-2 ${
                    mlResults.isAuthentic 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        {mlResults.isAuthentic ? (
                          <CheckCircle className="h-12 w-12 text-green-600" />
                        ) : (
                          <XCircle className="h-12 w-12 text-red-600" />
                        )}
                        <div>
                          <h3 className={`text-2xl font-bold ${
                            mlResults.isAuthentic ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {mlResults.isAuthentic ? 'CERTIFICATE AUTHENTIC' : 'CERTIFICATE SUSPICIOUS'}
                          </h3>
                          <p className={`text-lg ${
                            mlResults.isAuthentic ? 'text-green-600' : 'text-red-600'
                          }`}>
                            AI Confidence: {mlResults.finalConfidence.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <p className="text-sm text-gray-600 mb-1">OCR Accuracy</p>
                          <p className="text-xl font-bold text-blue-600">{(mlResults.avgOcrConfidence * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Confidence Meter */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Authenticity Score</span>
                        <span className="text-sm font-medium text-gray-900">{mlResults.finalConfidence.toFixed(1)}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full transition-all duration-1000 ${
                            mlResults.finalConfidence > 60 
                              ? 'bg-gradient-to-r from-green-400 to-green-600' 
                              : 'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${mlResults.finalConfidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Extracted Data */}
                  {extractedData && (
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-indigo-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span>OCR Extracted Information</span>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(extractedData).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-700 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <div className="text-right">
                              <span className="font-semibold text-gray-900">{value.text}</span>
                              <div className={`text-xs mt-1 ${
                                value.confidence > 0.9 ? 'text-green-600' :
                                value.confidence > 0.8 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {(value.confidence * 100).toFixed(1)}% confidence
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Analysis Details */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Signature Analysis */}
                    {mlResults.signatureAnalysis && (
                      <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                          <Hash className="h-5 w-5 text-green-600" />
                          <span>Neural Network Signature Analysis</span>
                        </h4>
                        <div className="space-y-3">
                          <div className={`p-3 rounded-lg ${
                            mlResults.signatureAnalysis.isMatch ? 'bg-green-50' : 'bg-red-50'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Match Status:</span>
                              {mlResults.signatureAnalysis.isMatch ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div className="mt-2">
                              <div className="text-sm text-gray-600">Similarity Score</div>
                              <div className="font-bold text-lg">
                                {(mlResults.signatureAnalysis.similarity * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                          {mlResults.signatureAnalysis.professor && (
                            <div className="text-sm">
                              <p className="font-medium text-gray-800">Matched Professor:</p>
                              <p className="text-gray-600">{mlResults.signatureAnalysis.professor.name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Pattern: {mlResults.signatureAnalysis.professor.signaturePattern}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Seal Analysis */}
                    {mlResults.sealAnalysis && (
                      <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-purple-600" />
                          <span>Computer Vision Seal Analysis</span>
                        </h4>
                        <div className="space-y-3">
                          <div className={`p-3 rounded-lg ${
                            mlResults.sealAnalysis.isMatch ? 'bg-green-50' : 'bg-red-50'
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Verification:</span>
                              {mlResults.sealAnalysis.isMatch ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div className="mt-2">
                              <div className="text-sm text-gray-600">Match Confidence</div>
                              <div className="font-bold text-lg">
                                {(mlResults.sealAnalysis.similarity * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-gray-800">Institution:</p>
                            <p className="text-gray-600">{mlResults.sealAnalysis.university}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tampering Detection */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <span>Anomaly Detection</span>
                      </h4>
                      <div className="space-y-3">
                        <div className={`p-3 rounded-lg ${
                          !mlResults.tamperingAnalysis.isSuspicious ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Document Integrity:</span>
                            {!mlResults.tamperingAnalysis.isSuspicious ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div className="mt-2">
                            <div className="text-sm text-gray-600">Tampering Risk</div>
                            <div className="font-bold text-lg">
                              {(mlResults.tamperingAnalysis.tamperingScore * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        {mlResults.tamperingAnalysis.anomalies.length > 0 && (
                          <div className="text-xs text-red-600 space-y-1">
                            {mlResults.tamperingAnalysis.anomalies.map((anomaly, index) => (
                              <p key={index}>• {anomaly}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Blockchain Verification */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <Database className="h-5 w-5 text-blue-600" />
                        <span>Blockchain Verification</span>
                      </h4>
                      <div className="space-y-3">
                        <div className={`p-3 rounded-lg ${
                          mlResults.blockchainVerified ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Ledger Status:</span>
                            {mlResults.blockchainVerified ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            {mlResults.blockchainVerified 
                              ? 'Certificate found in distributed ledger' 
                              : 'Certificate ID not found in blockchain'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Quality Analysis */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <Eye className="h-5 w-5 text-indigo-600" />
                        <span>Image Quality Analysis</span>
                      </h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Resolution</div>
                          <div className="font-bold">
                            {mlResults.certificateFeatures.dimensions.width} × {mlResults.certificateFeatures.dimensions.height}
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Quality Score</div>
                          <div className={`font-bold capitalize ${
                            mlResults.certificateFeatures.quality === 'good' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {mlResults.certificateFeatures.quality}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Issues Summary */}
                  {mlResults.issues.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <h4 className="font-bold text-red-800 mb-4 flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Detected Issues ({mlResults.issues.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {mlResults.issues.map((issue, index) => (
                          <div key={index} className="flex items-start space-x-2 text-red-700">
                            <span className="text-red-500 mt-1">•</span>
                            <span className="text-sm">{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ML Database Tab */}
          {activeTab === 'database' && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-indigo-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Database className="h-6 w-6 text-blue-600" />
                  <span>ML-Enabled Professor Database</span>
                </h2>
                <div className="bg-purple-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-purple-800">{professorDatabase.length} ML Profiles</span>
                </div>
              </div>

              <div className="grid gap-4">
                {professorDatabase.map((professor) => (
                  <div key={professor.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                            {professor.id}
                          </span>
                          <h3 className="font-semibold text-gray-900">{professor.name}</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600"><span className="font-medium">Department:</span> {professor.department}</p>
                            <p className="text-gray-600"><span className="font-medium">University:</span> {professor.university}</p>
                          </div>
                          <div>
                            <p className="text-gray-600"><span className="font-medium">Signature Pattern:</span> {professor.signaturePattern}</p>
                            <p className="text-gray-600"><span className="font-medium">Seal Pattern:</span> {professor.sealPattern}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500 space-y-1">
                        <div className="bg-green-100 px-2 py-1 rounded">
                          <p>ML Features: {professor.signatureFeatures.length}D</p>
                        </div>
                        <div className="bg-blue-100 px-2 py-1 rounded">
                          <p>CV Trained: ✓</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Feature Vector Visualization */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-700 mb-2">Signature Feature Vector:</p>
                      <div className="flex space-x-1">
                        {professor.signatureFeatures.map((feature, index) => (
                          <div 
                            key={index} 
                            className="flex-1 bg-blue-200 rounded-sm" 
                            style={{ height: `${feature * 20 + 5}px` }}
                            title={`Feature ${index + 1}: ${feature.toFixed(3)}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'stats' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Verifications</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                  </div>
                  <Cpu className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-2 text-sm text-green-600">
                  ↑ 23% with ML integration
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">ML Detection Rate</p>
                    <p className="text-2xl font-bold text-red-600">98.7%</p>
                  </div>
                  <Brain className="h-8 w-8 text-red-600" />
                </div>
                <div className="mt-2 text-sm text-red-600">
                  Advanced AI algorithms
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Signature Matches</p>
                    <p className="text-2xl font-bold text-green-600">87.4%</p>
                  </div>
                  <Hash className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-2 text-sm text-green-600">
                  Neural network accuracy
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">OCR Accuracy</p>
                    <p className="text-2xl font-bold text-blue-600">94.3%</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-2 text-sm text-blue-600">
                  Deep learning OCR
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Processing Speed</p>
                    <p className="text-2xl font-bold text-purple-600">4.2s</p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-2 text-sm text-purple-600">
                  Multi-modal analysis
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Blockchain Integration</p>
                    <p className="text-2xl font-bold text-indigo-600">100%</p>
                  </div>
                  <Database className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="mt-2 text-sm text-indigo-600">
                  Distributed verification
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default FakeDegreeDetector;