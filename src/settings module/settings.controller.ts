import { Body, Controller, Get, Param, Put, Query, Res, Version, UseGuards } from '@nestjs/common';
import { SetSettingDto } from './dto/set.setting.dto';
import { SettingService as PrimaryService } from './settings.service';
import { PageOptionsDto } from '../common/dtos';
import { ResponseHandlerService } from '../utils/response.handler.utils';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ObjectTransformerLib } from '../utils/object.transformers.lib';
import { EnumFieldsFilterMode } from '../utils/object.utils';
import { JwtAuthGuard, RBACGuard } from '../rbac module/auth/auth.guards';

@Controller('settings')
@ApiTags('Settings Management')
@UseGuards(JwtAuthGuard, RBACGuard)
@ApiBearerAuth('jwt')
export class SettingController {
    private readonly entityTitle = 'setting';
    constructor(
        private readonly configService: ConfigService,
        private readonly service: PrimaryService,
        private readonly rhService: ResponseHandlerService
    ) { }

    @Get('page')
    @Version("1")
    async list(@Res() res, @Query() pageOptionsDto: PageOptionsDto) {
        const [error, pageDto] = await this.service.list(pageOptionsDto, ['setting_name', 'setting_type']);

        pageDto.data = new ObjectTransformerLib(pageDto.data)
            .mongoToPureJSON()
            .filterFields(EnumFieldsFilterMode.remove, ["_id", "__v"])
            .getData()

        if (error)
            return this.rhService.errorHandler(res, error, `cannot get ${this.entityTitle}s list`);

        return this.rhService.dataPaginatedHandler(res, pageDto)
    }

    @Get(':setting_name')
    @Version("1")
    async getSettingValue(@Res() res, @Param('setting_name') setting_name: string) {
        const [error, setting] = await this.service.get(setting_name);

        if (error)
            return this.rhService.errorHandler(res, error, `cannot get ${this.entityTitle} details`);

        if (!setting) {
            return this.rhService.notFoundHandler(res, `${this.entityTitle}`)
        }

        const _setting = new ObjectTransformerLib(setting)
            .mongoToPureJSON()
            .filterFields(EnumFieldsFilterMode.remove, ["_id", "__v"])
            .getData()
        return this.rhService.dataHandler(res, _setting);
    }

    @Put()
    @Version("1")
    async setSettingValue(@Res() res, @Body() setSettingDto: SetSettingDto) {
        const [error] = await this.service.set(setSettingDto);
        if (error)
            return this.rhService.errorHandler(res, error, `cannot create ${this.entityTitle}`);

        return this.rhService.createdHandler(res, this.entityTitle);
    }

}