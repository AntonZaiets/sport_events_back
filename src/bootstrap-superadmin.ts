import { Repository } from 'typeorm'
import { User } from './user/entities/user.entity'
import * as argon2 from 'argon2'

export async function bootstrapSuperAdmin(userRepo: Repository<User>) {
    const email = 'superadmin@gmail.com'
    const password = 'StrongPass123'
    const uid = 11111111

    const exists = await userRepo.findOne({ where: { email } })
    if (exists) return console.log('SUPERADMIN already exists')

    const user = userRepo.create({
        uid,
        email,
        password: await argon2.hash(password),
        role: 'SUPERADMIN',
    })

    await userRepo.save(user)
    console.log('✅ SUPERADMIN created!')
}
