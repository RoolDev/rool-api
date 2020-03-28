import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function CompareClassProperties(
  prop: string,
  validationOptions?: ValidationOptions,
) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'compareClassProperties',
      async: false,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return new Promise(ok => {
            const password = args.object[prop];

            if (password !== value) {
              ok(false);
            } else {
              ok(true);
            }
          });
        },
      },
    });
  };
}
