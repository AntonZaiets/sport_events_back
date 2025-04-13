import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
	getHello(): string {
		return '2'
	}
	getProfile(): string {
		return 'Its my profile'
	}
}
