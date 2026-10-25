from django.urls import path
from .views import *

urlpatterns = [
    path("event/", EventCRUDGeneralView.as_view()),
    path("event/<int:id>/", EventCRUDDetailView.as_view()),
    path("event/available/", EventAvailableView.as_view()),
    path("event/<int:id>/detail/", EventDetailView.as_view()),
    path("event_category/", EventCategoryCRUDGeneralView.as_view()),
    path("event_category/<int:id>/", EventCategoryCRUDDetailView.as_view()),
    path("event_state/", EventStateCRUDGeneralView.as_view()),
    path("event_state/<int:id>/", EventStateCRUDDetailView.as_view()),
    path("event/<int:id>/open/", EventOpenView.as_view()),
    path("event/<int:id>/force_close/", EventForceCloseView.as_view()),
    path("event/<int:id>/resolve/", EventResolveView.as_view()),
    path("event/<int:id>/cancel/", EventCancelView.as_view()),
    path("option/", OptionCRUDGeneralView.as_view()),
    path("option/<int:id>/", OptionCRUDDetailView.as_view()),
]