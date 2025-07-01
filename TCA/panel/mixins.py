from django.shortcuts import redirect
from django.urls import reverse

class AccessKeyRequiredMixin:
    """Redirige a `access_key` si no hay `has_access` en la sesión."""
    def dispatch(self, request, *args, **kwargs):
        if not request.session.get('has_access', False):
            return redirect(reverse('user_admin:access_key'))
        return super().dispatch(request, *args, **kwargs)