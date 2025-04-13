/*
import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	async create(createUserDto: CreateUserDto) {
		const existUser = await this.userRepository.findOne({
			where: {
				email: createUserDto.email,
			},
		})
		if (existUser)
			throw new BadRequestException('This email already exist!')

		const user = await this.userRepository.save({
			email: createUserDto.email,
			password: await argon2.hash(createUserDto.password),
		})

		const token = this.jwtService.sign({ email: createUserDto.email })

		return { user, token }
	}

	async findOne(email: string) {
		return await this.userRepository.findOne({
			where: {
				email,
			},
		})
	}
}
*/

import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	private generateUniqueId(): number {
		return Math.floor(10000000 + Math.random() * 90000000)
	}

	async create(createUserDto: CreateUserDto) {
		const existUser = await this.userRepository.findOne({
			where: {
				email: createUserDto.email,
			},
		})
		if (existUser)
			throw new BadRequestException('This email already exists!')

		const uniqueId = this.generateUniqueId()

		// Створення нового користувача з унікальним ID
		const user = await this.userRepository.save({
			uid: uniqueId,
			email: createUserDto.email,
			password: await argon2.hash(createUserDto.password),
			role: 'USER',
		})

		const token = this.jwtService.sign({
			email: createUserDto.email,
			uid: user.uid,
		})

		return { user, token }
	}

	async updateUserRole(userId: number, newRole: string) {
		const user = await this.userRepository.findOneBy({ uid: userId });

		if (!user) throw new NotFoundException('Користувача не знайдено');

		user.role = newRole;
		await this.userRepository.save(user);

		return { message: `Роль оновлено на ${newRole}` };
	}

	async findOne(email: string) {
		return await this.userRepository.findOne({
			where: {
				email,
			},
		})
	}

	async findAll() {
		return this.userRepository.find()
	}
}
