
from django.urls import path
from . views import *


urlpatterns = [


    path('availablerooms', check_availability , name = 'check_availability' ),

    path('listrooms', MeetingRoomApi , name = 'listrooms' ),
    path('createroom', MeetingRoomApi , name = 'createroom' ),
    path('updateroom', MeetingRoomApi , name = 'updateroom' ),
    path('deleteroom/<int:meetingRoomId>', MeetingRoomApi , name = 'deleteroom' ),

    path('listbooks', BookingApi , name = 'listbooks' ),
    path('createbook', BookingApi, name='createbook'),
    path('updatebook', BookingApi , name = 'updatebook' ),
    path('deletebook/<int:bookingId>', BookingApi , name = 'deletebook' ),





]
