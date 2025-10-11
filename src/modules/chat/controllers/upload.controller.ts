import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat/upload')
export class UploadController {
  @Post('audio')
  @ApiOperation({ summary: 'Upload audio file for voice messages' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Audio file uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        fileUrl: { type: 'string' },
        fileName: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/audio',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'audio/mpeg',
          'audio/mp3',
          'audio/wav',
          'audio/ogg',
          'audio/webm',
          'audio/aac',
          'audio/m4a',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException({
              message: 'Invalid audio file type',
              messageAr: 'نوع ملف الصوت غير صالح',
            }),
            false,
          );
        }
      },
    }),
  )
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException({
        message: 'No file provided',
        messageAr: 'لم يتم تقديم أي ملف',
      });
    }

    // Construct file URL (you may want to use environment variable for base URL)
    const fileUrl = `${process.env.APP_URL || 'http://localhost:3001'}/uploads/audio/${file.filename}`;

    return {
      fileUrl,
      fileName: file.filename,
      message: 'Audio file uploaded successfully',
      messageAr: 'تم تحميل الملف الصوتي بنجاح',
    };
  }

  @Post('image')
  @ApiOperation({ summary: 'Upload image file for image messages' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image file uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        fileUrl: { type: 'string' },
        fileName: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException({
              message: 'Invalid image file type',
              messageAr: 'نوع ملف الصورة غير صالح',
            }),
            false,
          );
        }
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException({
        message: 'No file provided',
        messageAr: 'لم يتم تقديم أي ملف',
      });
    }

    // Construct file URL (you may want to use environment variable for base URL)
    const fileUrl = `${process.env.APP_URL || 'http://localhost:3001'}/uploads/images/${file.filename}`;

    return {
      fileUrl,
      fileName: file.filename,
      message: 'Image file uploaded successfully',
      messageAr: 'تم تحميل ملف الصورة بنجاح',
    };
  }
}
