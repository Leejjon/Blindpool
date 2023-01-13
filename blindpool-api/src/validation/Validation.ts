import {NextFunction, Request, Response} from "express";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";

export async function tryValidation<T extends Object>(req: Request, res: Response, next: NextFunction, type: any) {
    // For some reason the class-transformer and class-validator don't see arrays as a validation error.
    const requestBody: string = JSON.stringify(req.body);

    if (!(requestBody.startsWith('{') && requestBody.endsWith('}'))) {
        console.error(`Somebody tried to do a request with invalid json: ${requestBody}`);
        res.status(400);
        res.send("Invalid request.");
        return;
    }

    const responseBody: T = plainToClass(type, req.body as Object);
    let validationErrors = await validate(responseBody);

    if (validationErrors.length > 0) {
        validationErrors.forEach((validationError) => {
            console.log(validationError);
        });
        res.status(400);
        res.send("Invalid request.");
    } else {
        next();
    }
}
