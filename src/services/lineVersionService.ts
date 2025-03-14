// services/lineVersionService.ts
import prisma from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

export class LineVersionService {
  /**
   * Genera una nueva versión para una línea y la actualiza en la base de datos
   * @param tx Transacción de Prisma (opcional)
   * @param lineId ID de la línea
   * @returns Hash de la nueva versión
   */
  async updateLineVersion(
    tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>, 
    lineId: number
  ): Promise<string> {
    // Usar el cliente de transacción si se proporciona, o el cliente global si no
    const client = tx || prisma;
    
    // Generar un hash único para esta versión
    const versionHash = crypto
      .createHash('sha256')
      .update(`${lineId}-${Date.now()}`)
      .digest('hex');
    
    // Actualizar o crear el registro de versión
    await client.t_ng_line_version.upsert({
      where: { line_id: lineId },
      update: { 
        version_hash: versionHash
        // last_updated se actualiza automáticamente por @updatedAt
      },
      create: {
        line_id: lineId,
        version_hash: versionHash
      }
    });
    
    return versionHash;
  }

  /**
   * Obtiene la versión actual de una línea
   * @param lineId ID de la línea
   * @returns Hash de la versión actual o cadena vacía si no existe
   */
  async getLineVersion(lineId: number): Promise<string> {
    const version = await prisma.t_ng_line_version.findUnique({
      where: { line_id: lineId },
      select: { version_hash: true }
    });
    
    return version?.version_hash || '';
  }

  /**
   * Verifica si la versión proporcionada coincide con la actual
   * @param lineId ID de la línea
   * @param clientVersion Hash de versión del cliente
   * @returns true si las versiones coinciden, false si no
   */
  async verifyLineVersion(lineId: number, clientVersion: string): Promise<boolean> {
    const currentVersion = await this.getLineVersion(lineId);
    return currentVersion === clientVersion;
  }
}

// Exportar una instancia para uso directo
export const lineVersionService = new LineVersionService();