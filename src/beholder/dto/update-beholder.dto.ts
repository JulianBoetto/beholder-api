import { PartialType } from '@nestjs/mapped-types';
import { CreateBeholderDto } from './create-beholder.dto';

export class UpdateBeholderDto extends PartialType(CreateBeholderDto) {}
