from django import forms

class ResumeScreenForm(forms.Form):
    resume = forms.FileField()
    job_description = forms.CharField(widget=forms.Textarea)
    