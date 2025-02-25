# Field-Level Encryption for MongoDB

This project implements field-level encryption for sensitive data stored in MongoDB using Mongoose.

## Overview

The solution uses a custom Mongoose plugin that automatically encrypts specified fields before saving documents and decrypts them when retrieving documents. This provides an additional layer of security for sensitive information like API keys.

## Implementation Details

The encryption is implemented in `src/utils/encryptionPlugin.ts` with these key features:

- **AES-256-CTR Encryption**: Uses industry-standard encryption
- **Transparent Operation**: Encryption/decryption happens automatically
- **Field Specification**: You choose which fields to encrypt
- **Error Handling**: Graceful fallbacks if encryption/decryption fails

## How It Works

1. **Pre-save Hook**: Encrypts specified fields before saving to the database
2. **Post-init Hook**: Decrypts fields when documents are retrieved
3. **Query Middleware**: Handles encryption for update operations
4. **Custom Methods**: Provides methods to manually decrypt fields if needed

## Usage

To use field-level encryption in a model:

```typescript
import { encryptionPlugin } from '../utils/encryptionPlugin';

const MySchema = new mongoose.Schema({
  name: String,
  email: String,
  apiKey: String
});

// Apply encryption to sensitive fields
MySchema.plugin(encryptionPlugin, {
  fields: ['apiKey']
});

const MyModel = mongoose.model('MyModel', MySchema);
```

## Important Security Considerations

1. **Encryption Key**: 
   - Set the `ENCRYPTION_KEY` environment variable in production
   - The key should be at least 32 characters long
   - Store the key securely (not in version control)
   - Rotate keys periodically following a secure procedure

2. **Limitations**:
   - Querying on encrypted fields is limited to exact matches
   - Range queries, sorting, and text searches won't work on encrypted fields
   - Indexing encrypted fields has limited usefulness

3. **Data Migration**:
   - To change encryption keys, you'll need to:
     1. Retrieve all documents
     2. Decrypt with the old key
     3. Re-encrypt with the new key
     4. Save the updated documents

## Current Implementation

The encryption plugin is currently used to encrypt the following fields:

- `providers.openai.apiKey`
- `providers.deepseek.accessKey`
- `providers.x.accessKey`
- `providers.pinecone.apiKey`

## Dependencies

- Node.js Crypto module (built-in)
- Mongoose

## Development vs. Production

In development, the plugin uses a default encryption key. This is NOT secure for production use.

In production:
1. Set the `ENCRYPTION_KEY` environment variable to a secure, random 32+ character string
2. Do not share this key in logs, code, or repositories
3. Consider using a secrets manager like AWS Secrets Manager, Hashicorp Vault, or similar 