# tts_generate.py
# Usage:
#   python tts_generate.py --spec spec.json --outdir ./audio_out --engine gcloud
# Engines:
#   - gcloud (Google Cloud Text-to-Speech; requires GOOGLE_APPLICATION_CREDENTIALS)
#   - gtts   (gTTS online)
#   - pyttsx3 (offline; quality varies)
import argparse, os, json

def ensure_dir(p):
    os.makedirs(p, exist_ok=True)

def engine_gcloud(text, outpath, voice='en-US-Neural2-C', speaking_rate=1.0):
    from google.cloud import texttospeech
    client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice_params = texttospeech.VoiceSelectionParams(language_code="en-US", name=voice)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3, speaking_rate=speaking_rate)
    response = client.synthesize_speech(input=synthesis_input, voice=voice_params, audio_config=audio_config)
    with open(outpath, 'wb') as out:
        out.write(response.audio_content)

def engine_gtts(text, outpath, lang='en', tld='com', slow=False):
    from gtts import gTTS
    tts = gTTS(text=text, lang=lang, tld=tld, slow=slow)
    tts.save(outpath)

def engine_pyttsx3(text, outpath):
    import pyttsx3
    engine = pyttsx3.init()
    engine.save_to_file(text, outpath)
    engine.runAndWait()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--spec", required=True, help="JSON spec with items: [{'id':...,'text':...,'outfile':...,'rate':...}]")
    ap.add_argument("--outdir", required=True)
    ap.add_argument("--engine", choices=["gcloud","gtts","pyttsx3"], default="gcloud")
    args = ap.parse_args()
    ensure_dir(args.outdir)
    items = json.load(open(args.spec, "r", encoding="utf-8"))
    for it in items:
        text = it["text"]
        outfile = os.path.join(args.outdir, it["outfile"])
        rate = float(it.get("rate", 1.0))
        if args.engine=="gcloud":
            engine_gcloud(text, outfile, speaking_rate=rate)
        elif args.engine=="gtts":
            engine_gtts(text, outfile)
        else:
            engine_pyttsx3(text, outfile)
        print("Saved:", outfile)

if __name__ == "__main__":
    main()
