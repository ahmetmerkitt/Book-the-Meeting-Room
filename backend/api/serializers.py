from rest_framework import  serializers
from .models import *

class MettingRoomSerializer(serializers.ModelSerializer):
  class Meta:
    model = MeetingRoom

    fields = (
      "meetingRoomId",
      "name",
      "capacity"
    )



class BookingSerializer(serializers.ModelSerializer):

  class Meta:
    model = Booking
    fields = (
      "bookingId",
      "meetingRoom",
      "numberOfPeople",
      "startTime",
      "endTime"
    )



  def create(self, validated_data):

    roomname_data = validated_data.get('meetingRoom').meetingRoomId
    print(roomname_data,"aa")
    print(type(roomname_data),"bbb")
    roomName = MeetingRoom.objects.get(meetingRoomId=roomname_data)
    print(roomName,'ccc')
    booking = Booking.objects.create( **validated_data)

    return booking



  def update(self, instance, validated_data):

    roomname_data = validated_data.get('meetingRoom').meetingRoomId
    print(roomname_data,"kkk")
    room = MeetingRoom.objects.get(meetingRoomId=roomname_data)
    print(room,"laaa")
    instance.meetingRoom = room
    print("instanceeeee", instance)
    for key, value in validated_data.items():
      setattr(instance, key, value)
    instance.save()
    print("instanceee",instance)
    return instance


  def to_representation(self, instance):
    rep = super().to_representation(instance)
    if instance.meetingRoom:
      rep['meetingRoom'] = instance.meetingRoom.name

    return rep
