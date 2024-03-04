from django.http import JsonResponse

from django.http import Request
import logging

logger=logging.Logger('Exceptions')

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
class NotAcceptable(Exception):
    pass
class ServiceUnavailable(Exception):
    pass
class PermissionDenied(Exception):
    pass
class InternalServerError(Exception):
    pass

class ExceptionMiddleWare():
     def catch_exceptions_middleware(self,request:Request,call_next):
        try:
            return call_next(request)
        except NotFoundError as e:
            return JsonResponse(
                status_code=400,
                content={"Status": "Failed", "message": str(e)},  
            )
        except ValidationError as e:
            return JsonResponse(
                status_code=403,
                content={"Status": "Failed", "message": str(e)},  
            )
        except AlreadyExists as e:
            return JsonResponse(
                status_code=403,
                content={"Status": "Failed", "message": str(e)},  
            )
        except MethodNotAllowed as e:
            return JsonResponse(
                status_code=405,
                content={"Status": "Failed", "message": str(e)},  
            )
        except SerializerError as e:
            return JsonResponse(
                status_code=405,
                content={"Status": "Failed", "message": str(e)},  
            )
        except BadRequest as e:
            return JsonResponse(
                status_code=400,
                content={"Status": "Failed", "message": str(e)},  
            )
        except NotAcceptable as e:
            return JsonResponse(
                status_code=406,
                content={"Status": "Failed", "message": str(e)}, 
            )
        except ServiceUnavailable as e:
            return JsonResponse(
                status_code=503,
                content={"Status": "Failed", "message": str(e)},  
            )
        except PermissionDenied as e:
            return JsonResponse(
                status_code=403,
                content={"Status": "Failed", "message": str(e)},  
            )
        except InternalServerError as e:
            return JsonResponse(
                status_code=500,
                content={"Status": "Failed", "message": str(e)},  
            )

