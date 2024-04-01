import logging

logger = logging.Logger("Exceptions")


class NotFoundError(Exception):
    pass


class AlreadyExists(Exception):
    pass


class MethodNotAllowed(Exception):
    pass


class ValidationError(Exception):
    pass


class SerializerError(Exception):
    pass


class BadRequest(Exception):
    pass


class NotAcceptableOperation(Exception):
    def __init__(self, errors, message, status):
        super().__init__(errors)
        self.message = message
        self.status = status


class ServiceUnavailable(Exception):
    pass


class PermissionDenied(Exception):
    pass


class InternalServerError(Exception):
    pass
