import { BaseError } from "../error";

export const validAccountErrorTypes = ['InvalidRoleError', 'InvalidPasswordFormatError', 'DuplicateAccountError'] as const;
export type AccountErrorType = typeof validAccountErrorTypes[number];

export class InvalidRoleError extends BaseError {
  constructor(role: string, availableRoles: readonly string[]) {
    super(400, 'InvalidRoleError', `${role} is not a valid role. Valid roles are ${availableRoles.join(', ')}.`, {
      role, availableRoles
    });
  }
}

export class InvalidFormatError extends BaseError {
  constructor(invalidKeys: string[]) {
    super(400, 'InvalidFormatError', `${invalidKeys.join(', ')} format is invalid.`);
  }
}

export class DuplicateAccountError extends BaseError {
  constructor(duplicateKey: string, duplicateValue: string) {
    super(403, 'DuplicateAccountError', `An account where ${duplicateKey} is ${duplicateValue} already exists.`, {
      duplicateKey,
      duplicateValue
    });
  }
}
