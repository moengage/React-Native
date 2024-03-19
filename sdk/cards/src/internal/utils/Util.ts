/**
 * @file contains the utility function
 * @author Abhishek Kumar
 * @since 1.0.0
 */

export function getEnumByName<T>(enumType: any, enumValue: string): T {
    enumValue = enumValue.toUpperCase();
    const typedEnumValue = enumValue as unknown as T;
    const enumIndex = enumType[typedEnumValue]
    return enumType[enumIndex];
}

export function assertUnsupportedError(errorMessage: string): never {
    throw new Error(errorMessage);
}