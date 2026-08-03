const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 64-character (32-byte) hex string');
  }
  return Buffer.from(key, 'hex');
};

const encryptField = (text) => {
  if (!text) return text;
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

const decryptField = (encryptedText) => {
  if (!encryptedText) return encryptedText;
  if (typeof encryptedText !== 'string' || !encryptedText.includes(':')) {
    return encryptedText; // Probably not encrypted
  }
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) return encryptedText;
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    return null;
  }
};

const encryptTaskFields = (task) => {
  if (!task) return task;
  const sensitiveFields = ['email', 'password', 'character', 'vpn'];
  const encryptedTask = { ...task };
  
  for (const field of sensitiveFields) {
    if (encryptedTask[field]) {
      encryptedTask[field] = encryptField(encryptedTask[field]);
    }
  }
  return encryptedTask;
};

const decryptTaskFields = (task) => {
  if (!task) return task;
  const sensitiveFields = ['email', 'password', 'character', 'vpn'];
  const decryptedTask = { ...task };
  
  for (const field of sensitiveFields) {
    if (decryptedTask[field]) {
      const decrypted = decryptField(decryptedTask[field]);
      if (decrypted !== null) {
        decryptedTask[field] = decrypted;
      }
    }
  }
  return decryptedTask;
};

module.exports = {
  encryptField,
  decryptField,
  encryptTaskFields,
  decryptTaskFields
};
