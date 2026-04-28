from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable


@dataclass(frozen=True, slots=True)
class ContextFragment:
    key: str
    text: str
    keywords: tuple[str, ...]


CONTEXT_LIBRARY: tuple[ContextFragment, ...] = (
    ContextFragment(
        key="pat-garrett",
        text="The song was written for a dying sheriff in Pat Garrett & Billy the Kid, so resignation and release are in the work's original DNA.",
        keywords=("death", "end", "goodbye", "letting go", "tired", "role", "sheriff", "lawman"),
    ),
    ContextFragment(
        key="badge-line",
        text="The line 'Mama, take this badge off of me' turns the badge into a symbol of duty, identity, and a role that can no longer be carried.",
        keywords=("badge", "role", "identity", "duty", "uniform", "expectation", "self"),
    ),
    ContextFragment(
        key="door-meaning",
        text="In the song, heaven's door is not just doctrine or afterlife; it is the threshold where a burdened self can no longer go on in the old form.",
        keywords=("door", "threshold", "crossing", "change", "end", "transition", "become"),
    ),
    ContextFragment(
        key="draft-end",
        text="1973 also marks the end of U.S. draft authority, giving the era a charged relationship to refusal, obligation, and release from imposed duty.",
        keywords=("duty", "obligation", "war", "pressure", "expectation", "system", "country", "service"),
    ),
    ContextFragment(
        key="counterculture",
        text="The anti-war counterculture turns personal refusal into public stance, where stepping away can be a moral act rather than retreat.",
        keywords=("resist", "refuse", "activism", "rebellion", "system", "identity"),
    ),
    ContextFragment(
        key="guns-ground",
        text="The buried guns in the song suggest more than surrender: they imply laying down violence, defense, and the habits that once kept a person alive.",
        keywords=("gun", "guns", "violence", "defense", "habit", "armor", "shield"),
    ),
    ContextFragment(
        key="sea-road",
        text="The 1997 film reframes heaven's door as a final road toward the sea, making the threshold feel less like doctrine and more like last desire.",
        keywords=("sea", "journey", "escape", "freedom", "road", "horizon"),
    ),
    ContextFragment(
        key="nobel-voice",
        text="Dylan's Nobel lecture insists songs are fulfilled in performance and hearing, which supports staging this project as spoken ritual rather than static text.",
        keywords=("voice", "song", "hearing", "story", "performance", "meaning"),
    ),
    ContextFragment(
        key="song-meaning",
        text="The song endures because it speaks in plain language about the instant when exhaustion, mortality, and release touch the same nerve.",
        keywords=("meaning", "mortality", "exhaustion", "release", "grief", "loss", "weariness"),
    ),
)


def select_context_fragments(confession: str, *, limit: int = 4) -> list[str]:
    lowered = confession.lower()
    scored: list[tuple[int, ContextFragment]] = []

    for fragment in CONTEXT_LIBRARY:
        score = sum(1 for keyword in fragment.keywords if keyword in lowered)
        scored.append((score, fragment))

    scored.sort(key=lambda item: item[0], reverse=True)

    always_include = {"pat-garrett", "badge-line"}
    chosen_keys: list[str] = []
    chosen_texts: list[str] = []

    for fragment in CONTEXT_LIBRARY:
        if fragment.key in always_include and len(chosen_texts) < limit:
            chosen_keys.append(fragment.key)
            chosen_texts.append(fragment.text)

    for score, fragment in scored:
        if score <= 0 or fragment.key in chosen_keys or len(chosen_texts) >= limit:
            continue
        chosen_keys.append(fragment.key)
        chosen_texts.append(fragment.text)

    if chosen_texts:
        return chosen_texts[:limit]

    fallback_order = ("pat-garrett", "badge-line", "draft-end", "song-meaning")
    fallback = [
        fragment.text
        for key in fallback_order
        for fragment in CONTEXT_LIBRARY
        if fragment.key == key
    ]
    return fallback[:limit]


def available_context_keys() -> Iterable[str]:
    return (fragment.key for fragment in CONTEXT_LIBRARY)
