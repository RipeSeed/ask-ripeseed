import { connectDB } from '@/models'
import User from '@/models/user/user.model'

/**
 * Checks if any admin user exists in the database
 * @returns {Promise<boolean>} True if at least one admin user exists, false otherwise
 */
export async function checkAdminExists(): Promise<boolean> {
  try {
    await connectDB()
    const userCount = await User.countDocuments()
    return userCount > 0
  } catch (error) {
    console.error('Error checking if admin exists:', error)
    // Default to false if there's an error, allowing registration as a safety measure
    return false
  }
} 