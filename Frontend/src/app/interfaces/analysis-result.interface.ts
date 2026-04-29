export interface AnalysisResult {
  class_index: number;
  class_name: string;
  confidence: number;
  gradcam_image: string; // base64
}