import crypto from 'crypto';
import config from '@/config';

/**
 * Encrypt and decrypt sensitive data (API keys, credentials)
 */
class EncryptionService {
  private algorithm = config.encryption.algorithm;
  private encryptionKey: Buffer;

  constructor() {
    // Ensure key is 32 bytes for aes-256
    const key = config.encryption.encryptionKey;
    this.encryptionKey = crypto
      .createHash('sha256')
      .update(String(key))
      .digest();
  }

  /**
   * Encrypt data
   */
  encrypt(data: Record<string, any>): string {
    const iv = crypto.randomBytes(12);
    const authTag = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.encryptionKey,
      iv
    );

    const jsonData = JSON.stringify(data);
    let encrypted = cipher.update(jsonData, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return iv + authTag + encrypted data
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt data
   */
  decrypt(encryptedData: string): Record<string, any> {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.encryptionKey,
      iv
    );

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }
}

export default new EncryptionService();
