import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Res, Version, UseGuards } from '@nestjs/common';
import { CreateUserDto as CreateDto } from './dto/create.user.dto';
import { UpdateUserDto as UpdateDto } from './dto/update.user.dto';
import { UsersService as PrimaryService } from './user.service';
import { PageOptionsDto } from '../../common/dtos';
import { ResponseHandlerService } from '../../utils/response.handler.utils';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ValidateMongoIdPipe } from '../../utils/mongo.utils';
import { hashMake } from '../../utils/encryption.utils';
import { EnumFieldsFilterMode, ObjectTransformerLib } from '../../utils/object.transformers.lib';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard, RBACGuard } from '../auth/auth.guards';

@Controller('user')
@ApiTags('User Management')
@UseGuards(JwtAuthGuard, RBACGuard)
@ApiBearerAuth('jwt')
export class UserController {
    private readonly entityTitle = 'user';
    constructor(
        private readonly configService: ConfigService,
        private readonly service: PrimaryService,
        private readonly rhService: ResponseHandlerService
    ) { }

    @Get('page')
    @Version("1")
    async list(@Res() res, @Query() pageOptionsDto: PageOptionsDto) {
        const [error, pageDto] = await this.service.list(pageOptionsDto, ['name', 'username']);

        if (error)
            return this.rhService.errorHandler(res, error, `cannot get ${this.entityTitle}s list`);


        pageDto.data = new ObjectTransformerLib(pageDto.data)
            .mongoToPureJSON()
            .filterFields(EnumFieldsFilterMode.remove, ['password'])
            .getData()

        return this.rhService.dataPaginatedHandler(res, pageDto)
    }

    @Get(':id')
    @Version("1")
    async one(@Res() res, @Param('id', ValidateMongoIdPipe) id: string) {
        const [error, user] = await this.service.one(id);

        if (error)
            return this.rhService.errorHandler(res, error, `cannot get ${this.entityTitle} details`);

        const _user = new ObjectTransformerLib(user)
            .mongoToPureJSON()
            .filterFields(EnumFieldsFilterMode.remove, ['password'])
            .getData()

        return this.rhService.dataHandler(res, _user);
    }

    @Put()
    @Version("1")
    async create(@Res() res, @Body() createDto: CreateDto) {

        const [error] = await this.service.create(createDto);
        if (error)
            return this.rhService.errorHandler(res, error, `cannot create ${this.entityTitle}`);

        return this.rhService.createdHandler(res, this.entityTitle);
    }

    @Delete(':id')
    @Version("1")
    async delete(@Res() res, @Param('id', ValidateMongoIdPipe) id: string) {
        const [error] = await this.service.remove(id);

        if (error)
            return this.rhService.errorHandler(res, error, `cannot delete ${this.entityTitle}`);

        return this.rhService.deletedHandler(res, this.entityTitle);
    }

    @Patch(':id')
    @Version("1")
    async update(@Res() res, @Param('id', ValidateMongoIdPipe) id: string, @Body() updateDto: UpdateDto) {
        /* if (updateDto.password)
            updateDto.password = await hashMake(updateDto.password);
        */
        const [error] = await this.service.update(id, updateDto);

        if (error)
            return this.rhService.errorHandler(res, error, `cannot update ${this.entityTitle}`);

        return this.rhService.updatedHandler(res, this.entityTitle);
    }

}