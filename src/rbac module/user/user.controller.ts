import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Res, Version } from '@nestjs/common';
import { CreateUserDto as CreateDto } from './dto/create.user.dto';
import { UpdateUserDto as UpdateDto } from './dto/update.user.dto';
import { UsersService as PrimaryService } from './user.service';
import { CheckUserDto } from './dto/check.user.dto';
import { PageOptionsDto } from '../../common/dtos';
import { ResponseHandlerService } from '../../utils/response.handler.utils';
import { ApiTags } from '@nestjs/swagger';
import { ValidateMongoIdPipe, documentToPureJSON } from '../../utils/mongo.utils';
import { hashMake } from '../../utils/encryption.utils';
import { EnumFieldsFilterMode, ObjectTransformerLib } from '../../utils/object.transformers.lib';
import { ConfigService } from '@nestjs/config';
import { AssignRolesDto } from './dto/assign.role.dto';
import { RoleService } from '../role/role.service';


@Controller('user')
@ApiTags('User Management')
export class UserController {
    private readonly entityTitle = 'user';
    constructor(
        private readonly configService: ConfigService,
        private readonly service: PrimaryService,
        private readonly rolesService: RoleService,
        private readonly rhService: ResponseHandlerService
    ) { }

    @Get('page')
    @Version("1")
    async list(@Res() res, @Query() pageOptionsDto: PageOptionsDto) {
        const [error, pageDto] = await this.service.list(pageOptionsDto, ['name', 'username']);

        if (error)
            return this.rhService.errorHandler(res, error, `cannot get ${this.entityTitle}s list`);

        pageDto.data = documentToPureJSON(pageDto.data)
        const transformer = new ObjectTransformerLib(pageDto.data)
        pageDto.data = transformer.filterFields(EnumFieldsFilterMode.remove, ['password']).getData()

        return this.rhService.dataPaginatedHandler(res, pageDto)
    }

    @Get(':id')
    @Version("1")
    async one(@Res() res, @Param('id', ValidateMongoIdPipe) id: string) {
        const [error, user] = await this.service.one(id);

        if (error)
            return this.rhService.errorHandler(res, error, `cannot get ${this.entityTitle} details`);

        const _user = documentToPureJSON(user)
        delete _user.password

        return this.rhService.dataHandler(res, user);
    }

    @Put()
    @Version("1")
    async create(@Res() res, @Body() createDto: CreateDto) {
        createDto.password = await hashMake(createDto.password);

        const [error] = await this.service.create(createDto);
        if (error)
            return this.rhService.errorHandler(res, error, `cannot create ${this.entityTitle}`);

        return this.rhService.createdHandler(res, `${this.entityTitle} created successfully`);
    }

    @Delete(':id')
    @Version("1")
    async delete(@Res() res, @Param('id', ValidateMongoIdPipe) id: string) {
        const [error] = await this.service.remove(id);

        if (error)
            return this.rhService.errorHandler(res, error, `cannot delete ${this.entityTitle}`);

        return this.rhService.deletedHandler(res, `${this.entityTitle} deleted successfully`);
    }

    @Patch(':id')
    @Version("1")
    async update(@Res() res, @Param('id', ValidateMongoIdPipe) id: string, @Body() updateDto: UpdateDto) {
        if (updateDto.password)
            updateDto.password = await hashMake(updateDto.password);

        const [error] = await this.service.update(id, updateDto);

        if (error)
            return this.rhService.errorHandler(res, error, `cannot update ${this.entityTitle}`);

        return this.rhService.updatedHandler(res, `${this.entityTitle} updated successfully`);
    }


    @Patch('assign/role')
    @Version('1')
    async assignRoles(@Res() res, @Body() assignRolesDto: AssignRolesDto) {
        const [error_user, user] = await this.service.one(assignRolesDto.user_id);
        if (error_user)
            return this.rhService.errorHandler(res, error_user, `cannot find ${this.entityTitle}`);

        const [error_roles, roles] = await this.rolesService.many(assignRolesDto.role_ids);
        if (error_roles)
            return this.rhService.errorHandler(res, error_roles, `cannot find roles`);

        user.roles = roles
        await user.save()

        return this.rhService.updatedHandler(res, `roles assigned successfully`);
    }


    @Post('checkuser')
    @Version("1")
    async checkUser(@Res() res, @Body() checkUserDto: CheckUserDto) {
        const [error, user] = await this.service.checkPassowrd(checkUserDto);
        if (error)
            return this.rhService.errorHandler(res, error, `cannot get ${this.entityTitle} details`);

        return this.rhService.dataHandler(res, user);
    }

}