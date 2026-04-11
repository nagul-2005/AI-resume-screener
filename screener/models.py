from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class ResumeScreen(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job_description = models.TextField()
    resume_text = models.TextField()
    match_score = models.IntegerField()
    missing_skills = models.TextField()
    strengths = models.TextField()
    suggestions = models.TextField()
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.match_score}'