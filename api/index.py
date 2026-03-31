import os

from fastapi import Depends, FastAPI  # type: ignore
from fastapi.responses import StreamingResponse  # type: ignore
from fastapi_clerk_auth import (  # type: ignore
    ClerkConfig,
    ClerkHTTPBearer,
    HTTPAuthorizationCredentials,
)
from openai import OpenAI  # type: ignore

app = FastAPI()

clerk_config = ClerkConfig(jwks_url=os.getenv("CLERK_JWKS_URL"))
clerk_guard = ClerkHTTPBearer(clerk_config)


@app.get("/api")
def idea(
    industry: str = "AI agents",
    creds: HTTPAuthorizationCredentials = Depends(clerk_guard),
):
    user_id = creds.decoded["sub"]  # User ID from JWT - available for future use

    client = OpenAI()
    prompt = [
        {
            "role": "user",
            "content": (
                f"Reply with a new business idea for the {industry} industry, "
                "focusing on AI Agent opportunities. "
                "Format your response with headings, sub-headings and bullet points."
            ),
        }
    ]
    stream = client.chat.completions.create(
        model="gpt-4o-mini", messages=prompt, stream=True
    )

    def event_stream():
        for chunk in stream:
            text = chunk.choices[0].delta.content
            if text:
                lines = text.split("\n")
                for line in lines[:-1]:
                    yield f"data: {line}\n\n"
                    yield "data:  \n"
                yield f"data: {lines[-1]}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
