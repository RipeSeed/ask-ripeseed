import { UploadedFile } from '../_components/UploadDocument'

export function validateReq(file: UploadedFile, apiKey: string | null) {
  let msg = ''
  if (!file?.size) {
    msg = 'File is required.'
    return {
      isValid: false,
      msg,
    }
  }
  if (!apiKey) {
    msg = 'API Key is required.'
    return {
      isValid: false,
      msg,
    }
  }
  if (file.size > 5 * 1024 * 1024) {
    msg = 'File size should be less than 5MB.'
    return {
      isValid: false,
      msg,
    }
  }
  if (file.type !== 'application/pdf') {
    msg = 'Only PDF files are allowed.'
    return {
      isValid: false,
      msg,
    }
  }
  return {
    isValid: true,
    msg,
  }
}
