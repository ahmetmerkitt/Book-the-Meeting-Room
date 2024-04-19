
import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.utils import timezone
from .models import *
from .serializers import *


@csrf_exempt
def MeetingRoomApi(request, meetingRoomId=0):
    if request.method == 'GET':
        meetingrooms = MeetingRoom.objects.all()
        meetingroom_serializer = MettingRoomSerializer(meetingrooms, many=True)
        return JsonResponse(meetingroom_serializer.data, safe=False)

    elif request.method == 'POST':
        meetingroom_data = JSONParser().parse(request)
        print(meetingroom_data, "dataeeee")
        meetingroom_serializer = MettingRoomSerializer(data=meetingroom_data)
        if meetingroom_serializer.is_valid():
            meetingroom_serializer.save()
            return JsonResponse("Toplanti odasi basariyla eklendi", safe=False)
        return JsonResponse('Ekleme Basarisiz', safe=False)

    elif request.method == 'PUT':
        meetingroom_data = JSONParser().parse(request)
        meetingroom = MeetingRoom.objects.get(
            meetingRoomId=meetingroom_data["meetingRoomId"])
        meetingroom_serializer = MettingRoomSerializer(
            meetingroom, data=meetingroom_data)
        if meetingroom_serializer.is_valid():
            meetingroom_serializer.save()
            return JsonResponse("Guncelleme  Basarili!!", safe=False)
        return JsonResponse("Guncelleme Basarisiz.", safe=False)

    elif request.method == 'DELETE':
        meetingroom = MeetingRoom.objects.get(meetingRoomId=meetingRoomId)
        meetingroom.delete()
        return JsonResponse("Silme Islemi Basarili!!", safe=False)


@csrf_exempt
def BookingApi(request, bookingId=0):
    if request.method == 'GET':
        bookings = Booking.objects.all()
        booking_serializer = BookingSerializer(bookings, many=True)
        return JsonResponse(booking_serializer.data, safe=False)

    elif request.method == 'POST':
        booking_data = JSONParser().parse(request)
        print(booking_data,"tess")
        print(booking_data['meetingRoom'],"beforeroom")
        room = MeetingRoom.objects.get(name=booking_data['meetingRoom'])
        print(room,"room obje")
        booking_data['meetingRoom'] = room.meetingRoomId
        already_booked = Booking.objects.filter(
            meetingRoom=booking_data['meetingRoom'],
            startTime__lt=booking_data['endTime'],
            endTime__gt=booking_data['startTime']
        )
        if already_booked.exists():
            raise serializers.ValidationError(
                "This room is already booked for the dates entered.")

        room = MeetingRoom.objects.get(
            meetingRoomId=booking_data['meetingRoom'])

        if int(booking_data['numberOfPeople']) > room.capacity:
            raise serializers.ValidationError(
                "The meeting room does not have enough space for all that people.")
        booking_serializer = BookingSerializer(data=booking_data)

        if booking_serializer.is_valid():
            booking_serializer.save()
            return JsonResponse("Toplanti odasi rezervasyonu basariyla yapildi", safe=False)
        return JsonResponse(booking_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        booking_data = JSONParser().parse(request)
        room = MeetingRoom.objects.get(name=booking_data['meetingRoom'])
        booking_data['meetingRoom'] = room.meetingRoomId
        print(booking_data, "oooo")
        update_validation = Booking.objects.exclude(pk=booking_data['bookingId']).filter(

            meetingRoom=booking_data['meetingRoom'],
            startTime__lt=booking_data['endTime'],
            endTime__gt=booking_data['startTime']
        )
        if update_validation.exists():
            raise serializers.ValidationError(
                " 111 This room is already booked for the dates entered.")

        if booking_data['numberOfPeople'] > room.capacity:
            raise serializers.ValidationError(
                "The meeting room does not have enough space for all that people.")
        booking_serializer = BookingSerializer(data=booking_data)

        booking = Booking.objects.get(bookingId=booking_data["bookingId"])
        booking_serializer = BookingSerializer(booking, data=booking_data)
        if booking_serializer.is_valid():
            booking_serializer.save()
            return JsonResponse("Guncelleme  Basarili!!", safe=False)
        return JsonResponse(booking_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        booking = Booking.objects.get(bookingId=bookingId)
        booking.delete()
        return JsonResponse("Silme Islemi Basarili!!", safe=False)


@csrf_exempt
def check_availability(request):
    if request.method == 'POST':

        data = json.loads(request.body)
        capacity = data.get('numberOfPeople')
        between = data.get('between')
        startTime = between[0]
        endTime = between[1]

        print(capacity, "capacity")

        print(startTime, endTime, "start and end ")

        if capacity is None or between is None:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

        start_time = timezone.datetime.strptime(startTime, '%Y-%m-%d')
        end_time = timezone.datetime.strptime(endTime, '%Y-%m-%d')

        # kapasiteye gore minumum o olacak filtreleme yapar
        available_rooms = MeetingRoom.objects.filter(capacity__gte=capacity)

        # musteri tarafindan verilan tarihler arasinda eger bir rezervasyon varsa onu filtreler
        booked_rooms = Booking.objects.filter(startTime__lte=end_time, endTime__gte=start_time).values_list(
            'meetingRoom', flat=True)

        available_rooms = available_rooms.exclude(pk__in=booked_rooms)
        available_rooms = available_rooms.order_by('capacity')

        available_rooms_data = []
        for room in available_rooms:
            available_rooms_data.append({
                'roomId': room.meetingRoomId,
                'roomName': room.name,
                'between': f"{start_time.strftime('%Y-%m-%d')} - {end_time.strftime('%Y-%m-%d')}",
                'capacity': room.capacity,
            })

        return JsonResponse({'available_rooms': available_rooms_data})

    return JsonResponse({'error': 'Invalid request'})
