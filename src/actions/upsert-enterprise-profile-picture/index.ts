'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { enterprisesTable } from '@/db/schema'
import { uploadToLocal } from '@/lib/upload-image'

export async function uploadEnterpriseProfilePicture(formData: FormData, enterpriseId: string) {
    const file = formData.get('photo') as File
    if (!file || file.size === 0) {
        throw new Error('Imagem inválida')
    }

    const imageUrl = await uploadToLocal(file)

    await db.update(enterprisesTable)
        .set({ avatarImageURL: imageUrl })
        .where(eq(enterprisesTable.id, enterpriseId))

    return { url: imageUrl }
}
