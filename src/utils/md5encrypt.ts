import { createCipheriv, scryptSync, createDecipheriv } from 'crypto';

// 加密
export const aes256Encrypt: (password: string) => string = (password: string) => {
  const iv = Buffer.alloc(16, 0); // 生成16字节的Initialization vector
  const key = (scryptSync(password, 'salt', 32)) as Buffer; // 生成密钥Key
  const cipher = createCipheriv('aes-256-ctr', key, iv); // 使用aes算法 加密长度256位 加密认证方法ctr
  let encryptedText = cipher.update(password, 'utf-8', 'hex');
  encryptedText += cipher.final('hex');
  return encryptedText;
}

// 解密
export const aes256Decrypt: (password: string, databasePassword: string) => string = (password: string, databasePassword: string) => {
  const iv = Buffer.alloc(16, 0); // 生成16字节的Initialization vector
  const key = (scryptSync(password, 'salt', 32)) as Buffer; // 生成密钥Key
  const decipher = createDecipheriv('aes-256-ctr', key, iv);
  let decryptedText = decipher.update(databasePassword, 'hex', 'utf-8');
  decryptedText += decipher.final('utf-8');
  return decryptedText;
}
