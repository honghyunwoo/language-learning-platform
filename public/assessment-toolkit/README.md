# Assessment & Production Toolkit
생성일: 2025-10-11

## 포함 파일
- placement_form.html — 자가 채점 가능한 온라인 폼(브라우저에서 열기)
- placement_autograder.xlsx — 정답키/응답/점수 시트(수식 안내 포함)
- tts_generate.py — TTS 생성 스크립트 (gcloud/gTTS/pyttsx3 지원)
- tts_manifest_example.json — 예시 매니페스트
- speaking_rubric_enhanced.xlsx — 스피킹 채점표(기술 서술+점수 입력)

## 사용법
1) 레벨테스트 온라인 폼
   - 파일을 브라우저로 열고 응답 후 [채점하기]를 눌러 점수/레벨을 확인합니다.
   - [결과 CSV 저장]으로 결과를 내려받아 Excel 시트의 Responses 시트에 붙여넣습니다.

2) 자동 채점 시트(Excel)
   - AnswerKey와 Responses를 기준으로 Score 시트 지시에 따라 수식을 적용하세요.
   - 자기평가(s1,s2)는 ((s1-3)+(s2-3))*0.5로 보정값을 추가합니다.

3) TTS 생성
   - Python 환경에서 필요한 엔진을 설치하세요.
     * Google Cloud TTS: `pip install google-cloud-texttospeech` + 서비스 계정 설정
     * gTTS: `pip install gTTS`
     * pyttsx3: `pip install pyttsx3`
   - 예시: `python tts_generate.py --spec tts_manifest_example.json --outdir ./audio_out --engine gcloud`

4) 스피킹 채점표
   - Scores 시트에 학생 이름과 각 기준(1~5)을 입력하면 Total(Avg)을 계산해 전체 점수를 확인합니다.
