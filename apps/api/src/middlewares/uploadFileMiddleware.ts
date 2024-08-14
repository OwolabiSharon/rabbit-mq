import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { UploadedFile } from 'express-fileupload';

@Injectable()
export class UploadFileMiddleware implements NestMiddleware {
  private readonly logger = new Logger(UploadFileMiddleware.name);
  async use(req: Request, res: Response, next: NextFunction) {
    // if an image is provided then run the code below
    if (req['files']) {
      const pic = req['files'].pic as UploadedFile;

      // check to see that is an image and not anything else
      if (!pic.mimetype.startsWith('image')) {
        throw new HttpException(
          'Please upload an image',
          HttpStatus.BAD_REQUEST,
        );
      }

      try {
        const result = await cloudinary.uploader.upload(pic.tempFilePath, {
          use_filename: true,
          folder: 'Z2BE_Image',
        });
        fs.unlinkSync(pic.tempFilePath);
        req['pic'] = result.secure_url;
        return next();
      } catch (error) {
        this.logger.error(`Error uploading image to cloudinary. ${error}`);
      }
    }
    next();
  }
}
