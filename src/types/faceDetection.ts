export interface MatchResult {
  fileName: string
  webViewLink: string
  thumbnailLink: string
  similarity: number // 0.0 - 1.0
  confidence: string // "Very High", "High", "Medium", "Low"
}

export interface RecognitionResponse {
  success: boolean
  message: string
  matchCount: number
  matches: MatchResult[]
}

export interface CacheStatusResponse {
  totalFilesIndexed: number
  totalFacesStored: number
  lastIndexedAt: string | null
  databasePath: string
}

export type FaceFinderStatus =
  | 'idle'
  | 'selected'
  | 'uploading'
  | 'scanning'
  | 'success'
  | 'no-face'
  | 'no-match'
  | 'cache-empty'
  | 'error'
