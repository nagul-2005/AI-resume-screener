from rest_framework import serializers
from .models import ResumeScreen

class ResumeScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeScreen
        fields = ['id', 'match_score', 'created_at']