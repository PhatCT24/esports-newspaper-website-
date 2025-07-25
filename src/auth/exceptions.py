class UserAlreadyExists(Exception):
    """Raised when a user with the given email already exists."""
    pass

class PasswordsDoNotMatch(Exception):
    """Raised when password and password confirmation do not match."""
    pass

class UserNotFoundOrVerified(Exception):
    """Raised when a user does not exist or is already verified."""
    pass

class VerificationCodeExpired(Exception):
    """Raised when the verification code is expired or missing."""
    pass

class InvalidVerificationCode(Exception):
    """Raised when the verification code is invalid."""
    pass

class InvalidCredentials(Exception):
    """Raised when login credentials are incorrect."""
    pass
