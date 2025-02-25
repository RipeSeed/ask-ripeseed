import mongoose from 'mongoose';
import * as crypto from 'crypto';

/**
 * Field-Level Encryption Plugin for Mongoose
 * 
 * This plugin provides automatic encryption/decryption of sensitive fields
 * in MongoDB documents using AES-256-CTR encryption.
 * 
 * IMPORTANT SECURITY NOTES:
 * 1. Set ENCRYPTION_KEY as an environment variable in production
 * 2. The default key should NEVER be used in production
 * 3. The encryption key should be at least 32 characters long
 * 4. Store the key securely in a secrets manager or equivalent
 * 
 * Limitations:
 * - Querying on encrypted fields is limited to exact matches
 * - Range queries, partial matches, regex, etc. will not work on encrypted fields
 * - Indexing encrypted fields provides limited value due to the encryption
 * 
 * Usage Example:
 * ```
 * import { encryptionPlugin } from '../utils/encryptionPlugin';
 * 
 * const UserSchema = new mongoose.Schema({
 *   name: String,
 *   email: String,
 *   apiKey: String
 * });
 * 
 * UserSchema.plugin(encryptionPlugin, {
 *   fields: ['apiKey']
 * });
 * ```
 */

// Environment variable for encryption (create a strong, random key in production)
// Update the key handling to ensure 32 bytes
// generate using: openssl rand -hex 32
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '7a3f945f458198c0a63ba48c546cbeb37a3f945f458198c0a63ba48c546cbeb3'

// Ensure key is exactly 32 bytes
function getKey(): Buffer {
  if (Buffer.from(ENCRYPTION_KEY, 'hex').length !== 32) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters) for AES-256 encryption');
  }
  return Buffer.from(ENCRYPTION_KEY, 'hex');
}

function encrypt(text: string): string {
  if (!text) return text;
  
  try {
    const key = getKey();
    const hash = crypto.createHash('md5').update(text).digest('hex');
    const iv = Buffer.from(hash.substring(0, 16), 'utf8'); // 16 bytes IV
    
    // @ts-ignore
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    let encryptedText = cipher.update(text, 'utf8', 'hex');
    encryptedText += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encryptedText}`;
  } catch (error) {
    console.error('Encryption error:', error);
    return text;
  }
}

function decrypt(text: string): string {
  if (!text) return text;
  if (!text.includes(':')) return text;
  
  try {
    const key = getKey();
    const [ivHex, encryptedText] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    
    // @ts-ignore
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    let decryptedText = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedText += decipher.final('utf8');
    return decryptedText;
  } catch (error) {
    console.error('Decryption error:', error);
    return text;
  }
}

/**
 * Mongoose plugin for field-level encryption
 */
export function encryptionPlugin(schema: mongoose.Schema, options: { fields: string[] }) {
  const fieldsToEncrypt = options.fields || [];
  
  if (!fieldsToEncrypt.length) {
    console.warn('No fields specified for encryption plugin');
    return;
  }
  
  // Log the fields being encrypted in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Applying encryption to fields: ${fieldsToEncrypt.join(', ')}`);
  }
  
  // Encrypt fields before saving
  schema.pre('save', function(next) {
    try {
      for (const field of fieldsToEncrypt) {
        if (this.isModified(field)) {
          const value = this.get(field);
          if (value && typeof value === 'string') {
            this.set(field, encrypt(value));
          }
        }
      }
      next();
    } catch (error) {
      next(error as Error);
    }
  });
  
  // Decrypt fields when document is retrieved
  schema.post('init', function() {
    try {
      for (const field of fieldsToEncrypt) {
        const value = this.get(field);
        if (value && typeof value === 'string') {
          this.set(field, decrypt(value), { modified: false });
        }
      }
    } catch (error) {
      console.error('Error during decryption in init:', error);
    }
  });
  
  // Handle query operations
  function handleQuery(query: any, fieldsToEncrypt: string[]) {
    try {
      const update = query.getUpdate && query.getUpdate();
      const conditions = query.getFilter && query.getFilter();
      
      if (update) {
        // Handle direct field updates
        for (const field of fieldsToEncrypt) {
          if (update[field] && typeof update[field] === 'string') {
            update[field] = encrypt(update[field]);
          }
          
          // Handle $set operator
          if (update.$set && update.$set[field] && typeof update.$set[field] === 'string') {
            update.$set[field] = encrypt(update.$set[field]);
          }
        }
      }
      
      if (conditions) {
        // Handle query conditions
        for (const field of fieldsToEncrypt) {
          if (conditions[field] && typeof conditions[field] === 'string') {
            // Can't easily query encrypted fields - this is a limitation
            // For exact match queries, we could encrypt the value
            conditions[field] = encrypt(conditions[field]);
          }
        }
      }
    } catch (error) {
      console.error('Error handling query encryption:', error);
    }
  }
  
  // Add middleware for various query operations
  schema.pre('findOneAndUpdate', function(next) {
    handleQuery(this, fieldsToEncrypt);
    next();
  });
  
  schema.pre('updateOne', function(next) {
    handleQuery(this, fieldsToEncrypt);
    next();
  });
  
  schema.pre('updateMany', function(next) {
    handleQuery(this, fieldsToEncrypt);
    next();
  });
  
  // Add instance method to decrypt a specific field on demand
  schema.methods.getDecrypted = function(field: string) {
    try {
      const value = this.get(field);
      return typeof value === 'string' ? decrypt(value) : value;
    } catch (error) {
      console.error(`Error getting decrypted value for field ${field}:`, error);
      return null;
    }
  };
}