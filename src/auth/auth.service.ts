import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { IUser } from 'src/types/types'

@Injectable()
export class AuthService {
  constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email)
    const passwordIsMatch = await argon2.verify(user.password, password)

    if (user && passwordIsMatch) {
      return user
    }

    throw new UnauthorizedException('User or password are incorrect!')
  }

  async login(user: IUser) {
    const { id, uid, role, email } = user

    // Створюємо JWT токен
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      uid: user.uid,
      role: user.role,
    })

    // Повертаємо необхідні дані для фронтенду
    const response = {
      id,
      uid,
      role,
      email,
      token,
    }

    return response
  }
}
