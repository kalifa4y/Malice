import { StoreSettings } from '../types';
import { localDB } from './supabase';

const OTP_STORAGE_KEY = 'maison_alice_admin_reset_otp';

interface StoredResetOtp {
  email: string;
  code: string;
  expiresAt: number;
}

/**
 * Generates a readable backup recovery key (e.g. ALICE-7F4K-9M2P)
 */
export function generateBackupRecoveryKey(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const segment = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `ALICE-${segment(4)}-${segment(4)}`;
}

/**
 * Generates a 6-digit numeric reset code valid for 10 minutes
 */
export function createPasswordResetOtp(email: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const payload: StoredResetOtp = {
    email: email.trim().toLowerCase(),
    code,
    expiresAt: Date.now() + 10 * 60 * 1000
  };
  localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(payload));
  return code;
}

/**
 * Verifies a 6-digit reset OTP code against stored challenge
 */
export function verifyPasswordResetOtp(email: string, code: string): { valid: boolean; reason?: string } {
  try {
    const raw = localStorage.getItem(OTP_STORAGE_KEY);
    if (!raw) {
      return { valid: false, reason: 'Aucun code de récupération actif. Veuillez demander un nouveau code.' };
    }
    const parsed: StoredResetOtp = JSON.parse(raw);
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(OTP_STORAGE_KEY);
      return { valid: false, reason: 'Ce code a expiré (validité 10 minutes). Veuillez en générer un nouveau.' };
    }
    if (parsed.email !== email.trim().toLowerCase()) {
      return { valid: false, reason: 'Adresse email différente de celle ayant demandé le code.' };
    }
    if (parsed.code !== code.trim()) {
      return { valid: false, reason: 'Code de vérification à 6 chiffres incorrect.' };
    }
    localStorage.removeItem(OTP_STORAGE_KEY);
    return { valid: true };
  } catch {
    return { valid: false, reason: 'Erreur lors de la vérification du code.' };
  }
}

/**
 * Sends the 6-digit recovery code to the admin's registered email address
 * via FormSubmit AJAX endpoint (free, zero-backend email delivery)
 */
export async function sendRecoveryEmail(
  adminEmail: string,
  otpCode: string
): Promise<{ sent: boolean; message: string }> {
  const cleanEmail = adminEmail.trim().toLowerCase();

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(cleanEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        _subject: `Maison Alice Bamako — Code de récupération Admin (${otpCode})`,
        _template: 'table',
        _captcha: 'false',
        Marque: 'Maison Alice — Haute Confiserie Bamako',
        Action: 'Réinitialisation du mot de passe Administrateur',
        'Code de vérification (valide 10 min)': otpCode,
        Instructions:
          'Saisissez ce code à 6 chiffres sur la page #admin de Maison Alice pour choisir votre nouveau mot de passe.'
      })
    });

    if (response.ok) {
      return {
        sent: true,
        message: `Un code de récupération à 6 chiffres a été envoyé à ${cleanEmail}. Vérifiez votre boîte de réception (et vos courriers indésirables).`
      };
    }

    return {
      sent: false,
      message:
        "Le service d'envoi d'email n'a pas pu aboutir immédiatement. Vous pouvez utiliser votre Clé de Secours Admin ou réessayer."
    };
  } catch {
    return {
      sent: false,
      message:
        'Connexion au serveur mail indisponible. Vous pouvez réinitialiser votre accès immédiatement avec votre Clé de Secours Admin.'
    };
  }
}

/**
 * Registers or updates the admin account with email, password, and recovery key
 */
export function registerAdminAccount(
  email: string,
  password: string,
  customRecoveryKey?: string
): { settings: StoreSettings; recoveryKey: string } {
  const currentSettings = localDB.getSettings();
  const recoveryKey = (customRecoveryKey || currentSettings.adminRecoveryKey || generateBackupRecoveryKey())
    .trim()
    .toUpperCase();

  const updated: StoreSettings = {
    ...currentSettings,
    adminEmail: email.trim().toLowerCase(),
    adminPassword: password.trim(),
    adminRecoveryKey: recoveryKey,
    isAdminRegistered: true
  };

  localDB.saveSettings(updated);
  return { settings: updated, recoveryKey };
}
