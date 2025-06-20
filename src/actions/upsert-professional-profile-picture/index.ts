'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { professionalsTable } from '@/db/schema'
import { uploadToLocal } from '@/lib/upload-image'

export async function uploadProfessionalProfilePicture(formData: FormData, professionalId: string) {
    const file = formData.get('photo') as File
    if (!file || file.size === 0) {
        throw new Error('Imagem inválida')
    }

    const imageUrl = await uploadToLocal(file)

    await db.update(professionalsTable)
        .set({ avatarImageURL: imageUrl })
        .where(eq(professionalsTable.id, professionalId))

    return { url: imageUrl }
}
