import logging

logger = logging.Logger("Exceptions")


class NotFoundException(Exception):
    def __init__(self, errors, message, status):
        super().__init__(errors)
        self.message = message
        self.status = status


class AlreadyExistsException(Exception):
    pass


class MethodNotAllowedException(Exception):
    pass


class ValidationException(Exception):
    pass


class SerializerException(Exception):
    def __init__(self, errors, message, status):
        super().__init__(errors)
        self.message = message
        self.status = status


class BadRequestException(Exception):
    pass


class NotAcceptableOperationException(Exception):
    def __init__(self, errors, message, status):
        super().__init__(errors)
        self.message = message
        self.status = status


class ServiceUnavailableException(Exception):
    pass


class PermissionDeniedException(Exception):
    def __init__(self, errors, message, status):
        super().__init__(errors)
        self.message = message
        self.status = status


class InternalServerException(Exception):
    pass
