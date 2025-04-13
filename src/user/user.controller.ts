import {
	Controller,
	Get,
	Post,
	Body,
	UsePipes,
	ValidationPipe, Patch, Param,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto)
	}

	@Patch('/:uid/role')
	updateRole(
		@Param('uid') uid: number,
		@Body('role') role: string
	) {
		return this.userService.updateUserRole(uid, role);
	}

	@Get()
	findAll() {
		return this.userService.findAll()
	}
}
