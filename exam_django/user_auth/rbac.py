from rest_framework import permissions


class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            user_scope = request.user.user_scope
            if user_scope == "MANAGER":
                return True
            else:
                return False
        except Exception:
            return False


class IsLead(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            user_scope = request.user.user_scope
            if user_scope == "LEAD":
                return True
            else:
                return False
        except Exception:
            return False


class IsSystemAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            user_scope = request.user.user_scope
            if user_scope == "SYSTEM_ADMIN":
                return True
            else:
                return False
        except Exception:
            return False
