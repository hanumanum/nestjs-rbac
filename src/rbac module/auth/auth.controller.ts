
import { Controller, Get, Post, UseGuards, Version, Req, Body, Res, Param, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard, LocalAuthGuard } from './auth.guards';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../user/user.service';
import { ResponseHandlerService } from '../../utils/response.handler.utils';
import { errorLogger } from '../../utils/logger.utils';
import { sendEmail } from '../../utils/notification.utils';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly rh: ResponseHandlerService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @Version("1")
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.username);
    }

    @Get('verify-email/:uuid')
    @Version("1")
    async verifyEmail(@Res() res, @Param("uuid", new ParseUUIDPipe()) uuid: string) {
        try {
            const [error, user] = await this.userService.oneByUUID(uuid);
            if (error) {
                errorLogger(error);
                return this.rh.errorHandler(res, error, "Something went wrong");
            }

            if (!user)
                return this.rh.errorHandler(res, new Error("No such token"), "No such token");

            user.isEmailVerifyed = true;
            await user.save();

            return this.rh.generalSuccessHandler(res, "Email verified");
        }
        catch (error) {
            errorLogger(error);
            return this.rh.errorHandler(res, new Error("Something went wrong"));
        }

    }


    @Post('register')
    //@UseGuards(LocalAuthGuard)
    @Version("1")
    async register(@Body() registerDto: RegisterDto, @Res() res) {

        const [errorUN, userNameUsed] = await this.userService.oneByUsername(registerDto.username);
        if (errorUN) {
            errorLogger(errorUN);
            return this.rh.errorHandler(res, errorUN);
        }

        if (userNameUsed)
            return this.rh.errorHandler(res, new Error("Username already used"));

        const [errorEU, userEmailUsed] = await this.userService.oneByEmail(registerDto.email);
        if (errorEU) {
            errorLogger(errorEU);
            return this.rh.errorHandler(res, errorEU);
        }

        if (userEmailUsed)
            return this.rh.errorHandler(res, new Error("Email already used"));

        const [errorNewUser, newUser] = await this.authService.register(registerDto);
        if (errorNewUser) {
            errorLogger(errorNewUser);
            return this.rh.errorHandler(res, new Error("Error while registering user"));
        }

        const [errorEmail] = await sendEmail(newUser.email, "Email verification", "Please click on the link to verify your email", []);
        if (errorEmail) {
            errorLogger(errorEmail);
            return this.rh.errorHandler(res, new Error("Error while sending email"));
        }

        return this.rh.registrationHandler(res, "Registration successful, pleace check your email for verification link");

    }

    @Get('profile')
    @Version("1")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('jwt')
    getProfile(@Req() req) {
        return req.user;
    }
}
