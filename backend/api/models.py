from django.db import models




class MeetingRoom(models.Model):
  meetingRoomId = models.AutoField(primary_key=True)
  name = models.CharField(max_length=100,unique=True)
  capacity = models.IntegerField()

  def __str__(self):
    return str(self.meetingRoomId)



class Booking(models.Model):
    bookingId = models.AutoField(primary_key=True)
    meetingRoom = models.ForeignKey(MeetingRoom, on_delete=models.CASCADE)
    numberOfPeople = models.IntegerField()
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()


