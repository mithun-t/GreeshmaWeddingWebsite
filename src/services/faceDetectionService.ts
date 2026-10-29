import type {
  MatchResult,
  RecognitionResponse,
  CacheStatusResponse,
} from '../types/faceDetection.ts'

const RAW_API_URL = import.meta.env.VITE_FACE_API_URL || ''
const API_BASE_URL = RAW_API_URL ? RAW_API_URL.replace(/\/+$/, '') : ''

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB limit matching backend
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/bmp',
]

export class FaceDetectionError extends Error {
  public status?: number
  public isNoFace?: boolean
  public isCacheEmpty?: boolean

  constructor(
    message: string,
    options?: { status?: number; isNoFace?: boolean; isCacheEmpty?: boolean },
  ) {
    super(message)
    this.name = 'FaceDetectionError'
    this.status = options?.status
    this.isNoFace = options?.isNoFace
    this.isCacheEmpty = options?.isCacheEmpty
  }
}

/**
 * Uploads a photo to the Face Detection API to find matching Google Drive photos.
 */
export async function recognizeFace(file: File): Promise<RecognitionResponse> {
  // Validate file
  if (!file) {
    throw new FaceDetectionError('Please select or capture a photo first.')
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    throw new FaceDetectionError(
      `File size (${sizeMb} MB) exceeds the 10 MB limit. Please choose a smaller photo.`,
    )
  }

  const mime = file.type?.toLowerCase()
  if (mime && !ALLOWED_MIME_TYPES.includes(mime)) {
    throw new FaceDetectionError(
      `Unsupported file type (${file.type}). Please use JPG, PNG, or WebP.`,
    )
  }

  const formData = new FormData()
  formData.append('image', file, file.name || 'selfie.jpg')

  const endpoint = API_BASE_URL
    ? `${API_BASE_URL}/api/face/recognize`
    : '/api/face/recognize'

  let response: Response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Network connection failed'
    throw new FaceDetectionError(
      `Could not reach the Face Detection API at ${endpoint}. Make sure the backend server is running. (${errorMsg})`,
    )
  }

  let data: RecognitionResponse
  try {
    data = await response.json()
  } catch {
    throw new FaceDetectionError(
      `Unexpected response from server (HTTP ${response.status}).`,
      { status: response.status },
    )
  }

  // Handle 422: No face detected in uploaded image
  if (response.status === 422 || (data && !data.success && data.message?.toLowerCase().includes('no face'))) {
    throw new FaceDetectionError(
      data.message || 'No face was detected in your photo. Please try a clearer, well-lit selfie.',
      { status: 422, isNoFace: true },
    )
  }

  // Handle empty cache notice
  if (data && !data.success && data.message?.toLowerCase().includes('cache is empty')) {
    throw new FaceDetectionError(data.message, { isCacheEmpty: true })
  }

  if (!response.ok && !data.success) {
    throw new FaceDetectionError(data.message || `Server returned error (${response.status})`, {
      status: response.status,
    })
  }

  return {
    success: data.success,
    message: data.message,
    matchCount: data.matchCount ?? (data.matches ? data.matches.length : 0),
    matches: data.matches ?? [],
  }
}

/**
 * Checks the status and stats of the indexed Google Drive cache.
 */
export async function getCacheStatus(): Promise<CacheStatusResponse | null> {
  const endpoint = API_BASE_URL
    ? `${API_BASE_URL}/api/admin/status`
    : '/api/admin/status'

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
    })
    if (!response.ok) return null
    return (await response.json()) as CacheStatusResponse
  } catch {
    return null
  }
}
