"""
Word Orb with CrewAI
pip install crewai requests
"""

import os
import json
import requests
from crewai import Agent, Task, Crew
from crewai.tools import BaseTool

WORD_ORB_KEY = os.getenv("WORD_ORB_KEY")
BASE_URL = "https://word-orb-api.nicoletterankin.workers.dev"


class WordLookupTool(BaseTool):
    name: str = "Word Lookup"
    description: str = (
        "Look up any English word to get its definition, pronunciation (IPA), "
        "etymology, and translations in 47 languages. Input: a single word."
    )

    def _run(self, word: str) -> str:
        headers = {"Authorization": f"Bearer {WORD_ORB_KEY}"}
        resp = requests.get(f"{BASE_URL}/api/word/{word.strip()}", headers=headers)
        resp.raise_for_status()
        data = resp.json()
        return json.dumps({
            "word": data.get("word"),
            "definition": data.get("def"),
            "ipa": data.get("ipa"),
            "etymology": data.get("etym"),
            "translations": {
                "es": data.get("langs", {}).get("es"),
                "fr": data.get("langs", {}).get("fr"),
                "zh": data.get("langs", {}).get("zh"),
                "ja": data.get("langs", {}).get("ja"),
                "ar": data.get("langs", {}).get("ar"),
            },
        }, indent=2)


# Create agents
vocabulary_expert = Agent(
    role="Vocabulary Expert",
    goal="Provide accurate, detailed word information using the Word Orb API",
    backstory="You are a linguist with access to a comprehensive dictionary API.",
    tools=[WordLookupTool()],
    verbose=True,
)

# Create a task
lookup_task = Task(
    description="Look up the word '{word}' and provide its definition, etymology, and translations in Spanish, French, and Mandarin.",
    expected_output="A detailed word report with definition, pronunciation, etymology, and translations.",
    agent=vocabulary_expert,
)

# Run
crew = Crew(agents=[vocabulary_expert], tasks=[lookup_task])

# Example:
# result = crew.kickoff(inputs={"word": "resilience"})
# print(result)
