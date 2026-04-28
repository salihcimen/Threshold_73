from __future__ import annotations

import re
from typing import TypedDict

from langgraph.graph import END, START, StateGraph

from .providers.base import NarrativeProvider
from .services.context_library import select_context_fragments
from .services.prompts import ACTIVIST_PROMPT, ARCHIVIST_PROMPT, CODA_PROMPT, SHERIFF_PROMPT


class RitualState(TypedDict, total=False):
    confession: str
    context_fragments: list[str]
    provider_mode: str
    sheriff_response: str
    activist_response: str
    archivist_response: str
    epilogue_response: str


DEFAULT_CODA_LINE = "Lay down the badge; the lighter name is already waiting."


def normalize_coda_line(text: str, confession: str) -> str:
    themed_coda = craft_coda_fallback(confession)
    if themed_coda != DEFAULT_CODA_LINE:
        return themed_coda

    cleaned = re.sub(r"\s+", " ", text).strip().strip("\"'“”")
    if not cleaned:
        return DEFAULT_CODA_LINE

    sentence_parts = [
        part.strip(" \t\n\r-–—,;:\"'“”")
        for part in re.split(r"[.!?]+", cleaned)
        if part.strip()
    ]

    for part in sentence_parts:
        words = part.split()
        if 7 <= len(words) <= 12:
            candidate = f"{part[:1].upper()}{part[1:]}."
            if not line_feels_generic(candidate) and line_answers_confession(candidate, confession):
                return candidate

    if sentence_parts:
        first_part = sentence_parts[0]
        clause_parts = [
            part.strip(" \t\n\r-–—,;:\"'“”")
            for part in re.split(r"[,;:—-]+", first_part)
            if part.strip()
        ]
        for part in clause_parts:
            words = part.split()
            if 7 <= len(words) <= 12:
                candidate = f"{part[:1].upper()}{part[1:]}."
                if not line_feels_generic(candidate) and line_answers_confession(candidate, confession):
                    return candidate

        words = first_part.split()
        if 7 <= len(words) <= 12:
            candidate = f"{first_part[:1].upper()}{first_part[1:]}."
            if not line_feels_generic(candidate) and line_answers_confession(candidate, confession):
                return candidate

    return DEFAULT_CODA_LINE


def line_feels_generic(text: str) -> bool:
    lowered = text.lower()
    generic_phrases = (
        "be yourself",
        "find peace",
        "find the person",
        "find your true self",
        "set you free",
        "sets you free",
        "lighter self",
        "untethered",
        "unbound",
        "let go of the weight",
        "what's not yours to bear",
        "lies still",
        "hidden beneath the duty",
    )
    return any(phrase in lowered for phrase in generic_phrases)


def line_answers_confession(text: str, confession: str) -> bool:
    line_lower = text.lower()
    confession_lower = confession.lower()

    themed_checks = [
        (("obey", "obedien", "duty", "badge", "expect"), ("obey", "badge", "role", "uniform", "order", "command")),
        (("fear", "afraid", "anxious"), ("fear", "afraid", "tremble", "gate", "name")),
        (("graduate", "graduation", "school", "university", "degree"), ("robe", "diploma", "threshold", "costume", "name")),
        (("city", "home", "leave", "leaving", "move", "road"), ("road", "mile", "home", "door", "shore")),
        (("habit", "addiction", "quit", "smoke", "drink"), ("habit", "season", "mouth", "hand", "hunger", "thirst", "glass", "smoke")),
        (("grief", "loss", "mourning", "lost"), ("grief", "coat", "skin", "shadow", "name")),
        (("role", "identity", "mask", "self"), ("role", "badge", "mask", "name", "face")),
    ]

    for confession_signals, line_signals in themed_checks:
        if any(signal in confession_lower for signal in confession_signals):
            return any(signal in line_lower for signal in line_signals)

    return True


def craft_coda_fallback(confession: str) -> str:
    lowered = confession.lower()

    if any(signal in lowered for signal in ("obey", "obedien", "duty", "badge", "expect")):
        return "The self that survived by obeying need not wear the badge forever."

    if any(signal in lowered for signal in ("fear", "afraid", "anxious")):
        return "Fear may guard the door; it does not deserve your name."

    if any(signal in lowered for signal in ("graduate", "graduation", "school", "university", "degree")):
        return "The robe can fall away; the pulse beneath it is still yours."

    if any(signal in lowered for signal in ("city", "home", "leave", "leaving", "move", "road")):
        return "The road may take your footsteps; it does not own your name."

    if any(signal in lowered for signal in ("habit", "addiction", "quit", "smoke", "drink")):
        return "What kept you alive once does not have to name you."

    if any(signal in lowered for signal in ("grief", "loss", "mourning", "lost")):
        return "Grief may hold your coat awhile; it cannot become your skin."

    if any(signal in lowered for signal in ("role", "identity", "mask", "self")):
        return "The role can fall away; the pulse beneath it is still yours."

    return DEFAULT_CODA_LINE


def build_ritual_graph(provider: NarrativeProvider):
    async def enrich_context(state: RitualState) -> RitualState:
        confession = state["confession"]
        return {
            "context_fragments": select_context_fragments(confession),
            "provider_mode": provider.mode,
        }

    async def sheriff_node(state: RitualState) -> RitualState:
        return {
            "sheriff_response": await provider.generate(
                role_name="The Sheriff",
                system_prompt=SHERIFF_PROMPT,
                user_prompt=state["confession"],
                context_fragments=state["context_fragments"],
                temperature=0.35,
            )
        }

    async def activist_node(state: RitualState) -> RitualState:
        return {
            "activist_response": await provider.generate(
                role_name="The Activist",
                system_prompt=ACTIVIST_PROMPT,
                user_prompt=state["confession"],
                context_fragments=state["context_fragments"],
                temperature=0.62,
            )
        }

    async def archivist_node(state: RitualState) -> RitualState:
        combined_prompt = (
            f"User confession:\n{state['confession']}\n\n"
            f"Sheriff:\n{state['sheriff_response']}\n\n"
            f"Activist:\n{state['activist_response']}"
        )
        return {
            "archivist_response": await provider.generate(
                role_name="The Archivist",
                system_prompt=ARCHIVIST_PROMPT,
                user_prompt=combined_prompt,
                context_fragments=state["context_fragments"],
                temperature=0.56,
            )
        }

    async def epilogue_node(state: RitualState) -> RitualState:
        combined_prompt = (
            f"User confession:\n{state['confession']}\n\n"
            f"Sheriff:\n{state['sheriff_response']}\n\n"
            f"Activist:\n{state['activist_response']}\n\n"
            f"Balladeer:\n{state['archivist_response']}"
        )
        return {
            "epilogue_response": await provider.generate(
                role_name="The Coda",
                system_prompt=CODA_PROMPT,
                user_prompt=combined_prompt,
                context_fragments=state["context_fragments"],
                temperature=0.44,
            )
        }

    graph = StateGraph(RitualState)
    graph.add_node("enrich_context", enrich_context)
    graph.add_node("sheriff", sheriff_node)
    graph.add_node("activist", activist_node)
    graph.add_node("archivist", archivist_node)
    async def normalize_epilogue_node(state: RitualState) -> RitualState:
        return {
            "epilogue_response": normalize_coda_line(
                state["epilogue_response"],
                state["confession"],
            )
        }

    graph.add_node("epilogue", epilogue_node)
    graph.add_node("normalize_epilogue", normalize_epilogue_node)

    graph.add_edge(START, "enrich_context")
    graph.add_edge("enrich_context", "sheriff")
    graph.add_edge("enrich_context", "activist")
    graph.add_edge("sheriff", "archivist")
    graph.add_edge("activist", "archivist")
    graph.add_edge("archivist", "epilogue")
    graph.add_edge("epilogue", "normalize_epilogue")
    graph.add_edge("normalize_epilogue", END)

    return graph.compile()
