import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {bootstrapSuperAdmin} from "./bootstrap-superadmin";
import {User} from "./user/entities/user.entity";
import {DataSource} from "typeorm";

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	app.enableCors()
	const userRepo = app.get(DataSource).getRepository(User)
	await bootstrapSuperAdmin(userRepo)
	await app.listen(3001)
}
bootstrap()
