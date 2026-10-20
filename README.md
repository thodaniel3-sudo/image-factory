# AI Image Factory

An AI image generation, management, quality-control, and digital image sales preparation platform.

## Local Development Setup
1. Run `py -3.12 -m venv .venv`
2. Activate with `.\.venv\Scripts\Activate.ps1`
3. Install dependencies: `pip install -r backend/requirements.txt`
4. Run the server: `uvicorn app.main:app --reload` (from the `backend` folder)
