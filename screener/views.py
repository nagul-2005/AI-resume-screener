from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .forms import ResumeScreenForm
from .models import ResumeScreen
import PyPDF2
import json
from groq import Groq

# Create your views here.

def extract_text_from_pdf(pdf_file):
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
        
    return text

def analyze_with_groq(resume_text, job_description):
    client = Groq(api_key=settings.GROQ_API_KEY)

    prompt = f'''
    You are an expert HR recruiter and resume analyst.
    Analyse this resume against the job description below.

    Resume:
    {resume_text}

    Job Description:
    {job_description}

    Return ONLY a JSON object with exactly these keys:
    -match_score: a number between 0 and 100
    -strengths: a list of 3-5 strong matching skills
    -missing_skills: a list of 3-5 skills missing from resume
    - suggestions: a list of 3-5 improvement suggestions as plain strings only and make a 5th suggestion as suitable role by analysing the strength.
    - Do NOT include any nested objects or dictionaries in suggestions

    Return ONLY JSON. No extra Text.
    '''

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        response_format={'type':'json_object'}
    )

    content = response.choices[0].message.content
    content = content.replace('```json','').replace('```', '').strip()

    return content

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def screen_resume(request):
    pdf_file = request.FILES.get('resume')
    job_description = request.data.get('job_description')

    if not pdf_file or not job_description:
            return Response(
                 {'error': 'Resume and Job Description are required'},
                 status=status.HTTP_400_BAD_REQUEST
            )
    
    resume_text = extract_text_from_pdf(pdf_file)

    ai_response = analyze_with_groq(resume_text,job_description)
    result = json.loads(ai_response)


    # Step 5: Save to database
    screen = ResumeScreen.objects.create(
        user=request.user,
        resume_text=resume_text,
        job_description = job_description,
        match_score=result['match_score'],
        missing_skills=json.dumps(result['missing_skills']),
        strengths=json.dumps(result['strengths']),
        suggestions=json.dumps(result['suggestions'])
    )

    return Response({
        'id': screen.pk,
        'match_score': result['match_score'],
        'strengths': result['strengths'],
        'missing_skills': result['missing_skills'],
        'suggestions': result['suggestions']
    },status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_result(request,pk):
    try:
        screen = ResumeScreen.objects.get(pk=pk)
        return Response({
            'id':screen.pk,
            'match_score':screen.match_score,
            'strengths':json.loads(screen.strengths),
            'missing_skills':json.loads(screen.missing_skills),
            'suggestions':json.loads(screen.suggestions),
            'created_at':screen.created_at
        })
    except ResumeScreen.DoesNotExist:
         return Response(
              {'error':'Not found'},
              status=status.HTTP_404_NOT_FOUND
         )

# ── History API ──
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def history(request):
    screens = ResumeScreen.objects.filter(
        user=request.user
    ).order_by('-created_at')

    data = [{
        'id': s.pk,
        'match_score': s.match_score,
        'created_at': s.created_at
    } for s in screens]

    return Response(data)