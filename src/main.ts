import './style.css'
import { apiBaseUrl } from './config'
import radioTuningSfx from './assets/Radio Tuning sound effect.mp3'
import clunkTapeButtonSfx from './assets/clunk tape button.mp3'

const apiOrigin = apiBaseUrl.replace(/\/api$/, '')

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="grain"></div>
  <div class="sky"></div>

  <main class="page-shell">
    <section class="intro-scroll" id="intro-scroll">
      <div class="intro-sticky">
        <div class="intro-vignette"></div>
        <div class="intro-rings ring-a"></div>
        <div class="intro-rings ring-b"></div>
        <div class="intro-dust dust-a"></div>
        <div class="intro-dust dust-b"></div>

        <div class="intro-topbar">
          <div class="brand-lockup">
            <img
              class="brand-mark"
              src="/threshold73-mark.svg"
              alt="Threshold_73 logo"
              width="54"
              height="54"
            />
            <div class="brand-copy">
              <p class="eyebrow">Threshold_73 / The Room Behind the Song / transmission no. 1973</p>
              <p class="brand-title">Threshold_73</p>
            </div>
          </div>
          <p class="topbar-note">A threshold staged as radio, dusk, and confession.</p>
        </div>

        <div class="intro-copy">
          <p class="intro-line is-active" data-line="0">
            Some songs describe a death.
          </p>
          <p class="intro-line" data-line="1">
            Some deaths describe an era.
          </p>
          <p class="intro-line intro-line-wide" data-line="2">
            1973 leaves behind a sheriff, a badge, a war, and the old American frontier.
          </p>
          <p class="intro-line intro-line-final" data-line="3">
            Then the song turns toward you and asks:
            <span>what are you finally ready to leave behind?</span>
          </p>
        </div>

        <div class="intro-bottom">
          <div class="intro-track">
            <span>Pat Garrett & Billy the Kid</span>
            <span>anti-war dusk</span>
            <span>badge</span>
            <span>guns in the ground</span>
            <span>threshold</span>
          </div>
          <p class="scroll-cue">Scroll to enter the room</p>
        </div>
      </div>
      <div class="intro-step-track" aria-hidden="true">
        <div class="scroll-step" data-step="0"></div>
        <div class="scroll-step" data-step="1"></div>
        <div class="scroll-step" data-step="2"></div>
        <div class="scroll-step" data-step="3"></div>
      </div>
    </section>

    <section class="threshold-stage" id="threshold-stage">
      <div class="stage-backdrop"></div>
      <div class="stage-ambient" aria-hidden="true">
        <canvas class="stage-motion-canvas" id="stage-motion-canvas"></canvas>
        <div class="ambient-beam beam-a"></div>
        <div class="ambient-beam beam-b"></div>
        <div class="ambient-river river-a"></div>
        <div class="ambient-river river-b"></div>
        <div class="ambient-orb orb-a"></div>
        <div class="ambient-orb orb-b"></div>
        <div class="ambient-orb orb-c"></div>
        <div class="ambient-haze haze-a"></div>
        <div class="ambient-haze haze-b"></div>
        <div class="ambient-veil"></div>
        <div class="ambient-grid"></div>
      </div>

      <div class="stage-header">
        <div class="stage-header-copy">
          <div class="stage-brand">
            <img
              class="stage-brand-mark"
              src="/threshold73-mark.svg"
              alt="Threshold_73 logo"
              width="64"
              height="64"
            />
            <div>
              <p class="section-label">Threshold_73</p>
              <p class="stage-brand-subtitle">The Room Behind The Song</p>
            </div>
          </div>
          <h1 class="stage-title">The door opens only after the text learns how to breathe.</h1>
        </div>
        <p class="stage-intro">
          Not a chatbot screen. A chamber shaped by a death scene, a protest year, and a song
          about laying down the role that can no longer be carried.
        </p>
      </div>

      <div class="stage-grid">
        <aside class="history-rail">
          <article class="history-card">
            <p class="card-label">Council Voices</p>
            <div class="voice-list">
              <div>
                <span>01</span>
                <strong>The Sheriff</strong>
                <p>burden, surrender, dusk</p>
              </div>
              <div>
                <span>02</span>
                <strong>The Activist</strong>
                <p>rupture, refusal, fire</p>
              </div>
              <div>
                <span>03</span>
                <strong>The Balladeer</strong>
                <p>memory, afterlight, release</p>
              </div>
            </div>
          </article>
        </aside>

        <section class="door-column">
          <div class="door-stage">
            <div class="door-plaque">
              <span>Threshold Chamber</span>
              <strong>The room holds its breath behind the seam.</strong>
            </div>

            <div class="door-world" aria-hidden="true">
              <div class="door-atmosphere">
                <div class="atmosphere-smoke smoke-a"></div>
                <div class="atmosphere-smoke smoke-b"></div>
              </div>
              <div class="door-frame">
                <div class="door">
                  <div class="door-panel left">
                    <span class="brace top"></span>
                    <span class="brace bottom"></span>
                  </div>
                  <div class="door-seam"></div>
                  <div class="door-panel right">
                    <span class="brace top"></span>
                    <span class="brace bottom"></span>
                  </div>
                  <div class="knob"></div>
                </div>
                <div class="threshold-floor"></div>
              </div>
            </div>

            <article class="preview-card">
              <div class="preview-head">
                <p class="card-label">Threshold Pulse</p>
                <span id="character-count">0 / 480</span>
              </div>
              <p id="ritual-preview">The room waits where the badge, the voice, and the threshold meet.</p>
            </article>
          </div>
        </section>

        <aside class="prompt-column">
          <article class="prompt-card">
            <div class="card-pin" aria-hidden="true"></div>
            <p class="card-label">Confession Draft</p>
            <div class="prompt-tags">
              <span>badge</span>
              <span>guns</span>
              <span>door</span>
            </div>
            <p class="prompt-question">
              What role, defense, habit, grief, or old identity are you ready to put in the ground?
            </p>

            <label class="sr-only" for="threshold-input">Describe the threshold you are facing</label>
            <textarea
              id="threshold-input"
              maxlength="480"
              placeholder="I am standing at the edge of graduation, and I no longer know whether the person who got me here is the person I want to become."
            ></textarea>

            <div class="prompt-footer">
              <button type="button" class="knock-button">Leave the badge</button>
              <p class="footnote" id="request-status">
                First, you name what must be set down. Then the room answers in voices.
              </p>
            </div>
          </article>
        </aside>
      </div>

      <section class="responses-shell" id="responses-shell" hidden>
        <div class="responses-head">
          <div>
            <p class="section-label">The Council Responds</p>
            <h2 class="responses-title">Three voices gather, and a coda crosses the seam.</h2>
          </div>
          <p class="responses-intro" id="responses-meta" hidden></p>
        </div>

        <div class="broadcast-toolbar">
          <div class="broadcast-indicator" id="broadcast-indicator">
            <span class="broadcast-lamp" aria-hidden="true"></span>
            <p class="broadcast-copy" id="broadcast-copy">The room is silent, but listening.</p>
          </div>

          <div class="broadcast-controls">
            <button type="button" class="broadcast-button" id="broadcast-toggle">
              Voice relay on
            </button>
            <button type="button" class="broadcast-button is-secondary" id="broadcast-stop">
              Cut signal
            </button>
          </div>
        </div>

        <div class="transmission-chamber" id="transmission-chamber" hidden>
          <div class="chamber-visual" aria-hidden="true">
            <div class="chamber-ring ring-one"></div>
            <div class="chamber-ring ring-two"></div>
            <div class="chamber-ring ring-three"></div>
            <div class="chamber-core"></div>
            <div class="chamber-scan"></div>
            <div class="chamber-columns">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div class="chamber-copy">
            <p class="card-label">Transmission Chamber</p>
            <h3 class="chamber-title">The frequency is assembling the room.</h3>
            <p class="chamber-status" id="loading-status">Tuning the room to the first signal.</p>
            <p class="chamber-detail" id="loading-detail">
              Dust, memory, and old radio light are searching for a form your words can enter.
            </p>
          </div>
        </div>

        <div class="transmission-status" id="transmission-status" aria-live="polite">
          The chamber is holding its breath before the first voice.
        </div>

        <div class="responses-grid" id="responses-grid"></div>

        <section class="epilogue-shell" id="epilogue-shell" hidden aria-live="polite">
          <div class="epilogue-vignette" aria-hidden="true"></div>
          <div class="epilogue-halo" aria-hidden="true"></div>
          <div class="epilogue-copy-layer">
            <p class="card-label epilogue-label">The Coda</p>
            <h3 class="epilogue-quote is-awaiting" id="epilogue-quote"></h3>
            <div class="epilogue-actions">
              <button type="button" class="epilogue-button" id="epilogue-exit">
                Leave the room
              </button>
              <button
                type="button"
                class="epilogue-button is-secondary"
                id="epilogue-restart"
              >
                Begin again
              </button>
            </div>
          </div>
        </section>
      </section>
    </section>
  </main>
`

interface RitualAgent {
  agent_id: string
  display_name: string
  stance: string
  message: string
  audio_url?: string | null
}

interface RitualApiResponse {
  provider_mode: string
  tts_mode: string
  confession: string
  context_fragments: string[]
  agents: RitualAgent[]
}

const textarea = document.querySelector<HTMLTextAreaElement>('#threshold-input')
const counter = document.querySelector<HTMLSpanElement>('#character-count')
const preview = document.querySelector<HTMLParagraphElement>('#ritual-preview')
const knockButton = document.querySelector<HTMLButtonElement>('.knock-button')
const requestStatus = document.querySelector<HTMLParagraphElement>('#request-status')
const responsesShell = document.querySelector<HTMLElement>('#responses-shell')
const responsesGrid = document.querySelector<HTMLDivElement>('#responses-grid')
const responsesMeta = document.querySelector<HTMLParagraphElement>('#responses-meta')
const transmissionStatus = document.querySelector<HTMLDivElement>('#transmission-status')
const transmissionChamber = document.querySelector<HTMLDivElement>('#transmission-chamber')
const epilogueShell = document.querySelector<HTMLElement>('#epilogue-shell')
const epilogueQuote = document.querySelector<HTMLHeadingElement>('#epilogue-quote')
const epilogueExit = document.querySelector<HTMLButtonElement>('#epilogue-exit')
const epilogueRestart = document.querySelector<HTMLButtonElement>('#epilogue-restart')
const loadingStatus = document.querySelector<HTMLParagraphElement>('#loading-status')
const loadingDetail = document.querySelector<HTMLParagraphElement>('#loading-detail')
const broadcastCopy = document.querySelector<HTMLParagraphElement>('#broadcast-copy')
const broadcastIndicator = document.querySelector<HTMLDivElement>('#broadcast-indicator')
const broadcastToggle = document.querySelector<HTMLButtonElement>('#broadcast-toggle')
const broadcastStop = document.querySelector<HTMLButtonElement>('#broadcast-stop')
const introSection = document.querySelector<HTMLElement>('#intro-scroll')
const thresholdStage = document.querySelector<HTMLElement>('#threshold-stage')
const stageMotionCanvas = document.querySelector<HTMLCanvasElement>('#stage-motion-canvas')
const introSteps = Array.from(document.querySelectorAll<HTMLElement>('.scroll-step'))
const root = document.documentElement
const introLines = Array.from(document.querySelectorAll<HTMLElement>('.intro-line'))
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
const audioPlaybackSupported = typeof Audio !== 'undefined'
const minimumConfessionLength = 4
type WindowWithWebkitAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

const audioContextConstructor =
  window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext
const radioCueSupported = Boolean(audioContextConstructor)

let voiceRelayEnabled = audioPlaybackSupported || speechSupported
let activeBroadcastToken = 0
let audioContext: AudioContext | null = null
let activeHtmlAudio: HTMLAudioElement | null = null
let loadingLoopId: number | null = null

type AgentScoreId = 'sheriff' | 'activist' | 'archivist' | 'epilogue'

type AmbientScoreHandle = {
  agentId: AgentScoreId
  master: GainNode
  oscillators: OscillatorNode[]
  filter: BiquadFilterNode
  motifTimer: number | null
}

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })

let activeAmbientScore: AmbientScoreHandle | null = null
let activeLoadingAudio: HTMLAudioElement | null = null

const resetEpilogueOverlay = () => {
  if (!epilogueShell || !epilogueQuote) return

  epilogueShell.hidden = true
  epilogueShell.classList.remove('is-visible')
  epilogueQuote.textContent = ''
  epilogueQuote.className = 'epilogue-quote is-awaiting'
  document.body.classList.remove('epilogue-open')
}

const setEpilogueVisible = (visible: boolean) => {
  if (!epilogueShell) return

  epilogueShell.hidden = !visible
  epilogueShell.classList.toggle('is-visible', visible)
  document.body.classList.toggle('epilogue-open', visible)
}

const closeEpilogue = (target: 'responses' | 'top' = 'responses') => {
  resetEpilogueOverlay()

  if (target === 'top') {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
    return
  }

  responsesShell?.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  })
}

const typeText = async (
  element: HTMLElement,
  text: string,
  token: number,
  pace: 'measured' | 'close' | 'epigram' = 'measured',
) => {
  const baseDelay = pace === 'epigram' ? 52 : pace === 'close' ? 42 : 34
  const minimumRunTime = pace === 'epigram' ? 3000 : pace === 'close' ? 2000 : 2400
  const dynamicDelay = Math.ceil(minimumRunTime / Math.max(text.length, 1))
  const characterDelay = Math.max(baseDelay, dynamicDelay)
  const openingPause = prefersReducedMotion ? 180 : pace === 'epigram' ? 460 : 340

  element.textContent = ''
  element.classList.remove('is-awaiting')
  element.classList.add('is-typing')

  await wait(openingPause)

  for (let index = 0; index < text.length; index += 1) {
    if (token !== activeBroadcastToken) {
      element.classList.remove('is-typing')
      return
    }

    const character = text[index]
    const nextCharacter = text[index + 1] ?? ''

    element.textContent += character

    let pause = character === ' ' ? Math.max(24, characterDelay - 14) : characterDelay

    if (/[.!?]/.test(character)) {
      pause = pace === 'epigram' ? 320 : pace === 'close' ? 260 : 220
    } else if (/[,;:]/.test(character)) {
      pause = pace === 'epigram' ? 180 : 140
    } else if (character === '\n') {
      pause = 180
    } else if (character === ' ' && /[A-Z"'“]/.test(nextCharacter)) {
      pause = characterDelay + (pace === 'epigram' ? 46 : 36)
    }

    await wait(pause)
  }

  element.classList.remove('is-typing')
}

const setLoadingCopy = (status: string, detail: string) => {
  if (loadingStatus) loadingStatus.textContent = status
  if (loadingDetail) loadingDetail.textContent = detail
}

const clearLoadingLoop = () => {
  if (loadingLoopId !== null) {
    window.clearInterval(loadingLoopId)
    loadingLoopId = null
  }
}

const startLoadingLoop = (token: number) => {
  if (!transmissionChamber) return

  const states = [
    {
      status: 'Tuning the room to the first signal.',
      detail: 'Dust, memory, and old radio light are searching for a form your words can enter.',
    },
    {
      status: 'Aligning 1973 with the confession you left at the door.',
      detail: 'The film, the year, and the song are being drawn toward the same threshold.',
    },
    {
      status: 'Calling in the sheriff, the activist, the balladeer, and the coda.',
      detail: 'Three voices and one final inscription are moving toward the same seam in the dark.',
    },
    {
      status: 'Building a relay strong enough to carry a human answer.',
      detail: 'The chamber is gathering enough breath to let the song speak back.',
    },
  ]

  clearLoadingLoop()
  transmissionChamber.hidden = false
  transmissionChamber.classList.remove('is-resolving')
  transmissionChamber.classList.add('is-live')
  void startLoadingScan()
  setLoadingCopy(states[0].status, states[0].detail)

  let index = 0
  loadingLoopId = window.setInterval(() => {
    if (token !== activeBroadcastToken) {
      clearLoadingLoop()
      void stopLoadingScan(0.15)
      return
    }

    index = (index + 1) % states.length
    setLoadingCopy(states[index].status, states[index].detail)
  }, 2100)
}

const resolveLoadingLoop = async () => {
  if (!transmissionChamber) return

  clearLoadingLoop()
  await stopLoadingScan(0.42)
  await playLoadingLock()
  setLoadingCopy(
    'Signal received. Opening the chamber.',
    'The room has found its voices and is bringing them out of the dark.',
  )
  transmissionChamber.classList.add('is-resolving')
  await wait(prefersReducedMotion ? 80 : 720)
  transmissionChamber.hidden = true
  transmissionChamber.classList.remove('is-live', 'is-resolving')
}

const getAudioContext = async () => {
  if (!audioContextConstructor) return null

  if (!audioContext) {
    audioContext = new audioContextConstructor()
  }

  if (audioContext.state === 'suspended') {
    await audioContext.resume()
  }

  return audioContext
}

const startLoadingScan = async () => {
  if (activeLoadingAudio) {
    activeLoadingAudio.pause()
    activeLoadingAudio.currentTime = 0
    activeLoadingAudio = null
  }

  const audio = new Audio(radioTuningSfx)
  audio.preload = 'auto'
  audio.loop = true
  audio.volume = 0.28
  activeLoadingAudio = audio

  await audio.play().catch(() => {
    if (activeLoadingAudio === audio) {
      activeLoadingAudio = null
    }
  })
}

const stopLoadingScan = async (fadeSeconds = 0.3) => {
  if (!activeLoadingAudio) return

  const audio = activeLoadingAudio
  activeLoadingAudio = null

  const steps = Math.max(1, Math.round((fadeSeconds * 1000) / 40))
  const initialVolume = audio.volume

  for (let step = 1; step <= steps; step += 1) {
    audio.volume = Math.max(0, initialVolume * (1 - step / steps))
    await wait(40)
  }

  audio.pause()
  audio.currentTime = 0
}

const playLoadingLock = async () => {
  const audio = new Audio(clunkTapeButtonSfx)
  audio.preload = 'auto'
  audio.volume = 0.34
  await audio.play().catch(() => { })
}

const buildAmbientScore = (context: AudioContext, agentId: AgentScoreId) => {
  const master = context.createGain()
  master.gain.value = 0.0001

  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value =
    agentId === 'activist'
      ? 1680
      : agentId === 'archivist'
        ? 1520
        : agentId === 'epilogue'
          ? 1480
          : 1320
  filter.Q.value = 0.42

  const padGain = context.createGain()
  padGain.gain.value = agentId === 'activist' ? 0.104 : agentId === 'epilogue' ? 0.082 : 0.095

  const oscillators: OscillatorNode[] = []
  const voiceFrequencies: Record<AgentScoreId, number[]> = {
    sheriff: [164.81, 220, 246.94],
    activist: [196, 293.66, 392],
    archivist: [174.61, 261.63, 293.66],
    epilogue: [220, 293.66, 329.63],
  }

  voiceFrequencies[agentId].forEach((frequency, voiceIndex) => {
    const osc = context.createOscillator()
    const oscGain = context.createGain()
    osc.type =
      (agentId === 'activist' || agentId === 'epilogue') && voiceIndex === 1
        ? 'triangle'
        : 'sine'
    osc.frequency.value = frequency
    osc.detune.value = voiceIndex === 2 ? -2 : voiceIndex === 0 ? 2 : 0
    oscGain.gain.value = voiceIndex === 1 ? 0.42 : 0.26
    osc.connect(oscGain)
    oscGain.connect(padGain)
    osc.start()
    oscillators.push(osc)
  })

  const motifOsc = context.createOscillator()
  const motifFilter = context.createBiquadFilter()
  const motifGain = context.createGain()
  motifOsc.type = agentId === 'activist' ? 'triangle' : 'sine'
  motifFilter.type = 'lowpass'
  motifFilter.frequency.value = agentId === 'activist' ? 2100 : agentId === 'epilogue' ? 1880 : 1720
  motifGain.gain.value = 0.0001
  motifOsc.connect(motifFilter)
  motifFilter.connect(motifGain)
  motifGain.connect(filter)
  motifOsc.start()
  oscillators.push(motifOsc)

  const motifSequences: Record<AgentScoreId, number[]> = {
    sheriff: [329.63, 293.66, 246.94, 220],
    activist: [392, 440, 493.88, 587.33, 493.88],
    archivist: [293.66, 349.23, 392, 440, 392, 349.23],
    epilogue: [440, 392, 349.23, 329.63],
  }

  const motifStepMs =
    agentId === 'activist' ? 760 : agentId === 'archivist' ? 1040 : agentId === 'epilogue' ? 1240 : 940
  let motifIndex = 0
  const triggerMotif = () => {
    const now = context.currentTime
    const nextFrequency = motifSequences[agentId][motifIndex % motifSequences[agentId].length]
    motifIndex += 1

    motifOsc.frequency.cancelScheduledValues(now)
    motifOsc.frequency.setValueAtTime(nextFrequency, now)
    motifGain.gain.cancelScheduledValues(now)
    motifGain.gain.setValueAtTime(0.0001, now)
    motifGain.gain.exponentialRampToValueAtTime(
      agentId === 'activist' ? 0.09 : agentId === 'epilogue' ? 0.068 : 0.074,
      now + 0.08,
    )
    motifGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + (agentId === 'archivist' ? 0.92 : agentId === 'epilogue' ? 1.08 : 0.72),
    )
  }

  triggerMotif()
  const motifTimer = window.setInterval(triggerMotif, motifStepMs)

  const tremolo = context.createOscillator()
  const tremoloGain = context.createGain()
  tremolo.type = 'sine'
  tremolo.frequency.value =
    agentId === 'activist' ? 0.16 : agentId === 'archivist' ? 0.1 : agentId === 'epilogue' ? 0.08 : 0.07
  tremoloGain.gain.value = agentId === 'activist' ? 0.012 : agentId === 'epilogue' ? 0.008 : 0.009
  tremolo.connect(tremoloGain)
  tremoloGain.connect(master.gain)
  tremolo.start()
  oscillators.push(tremolo)

  padGain.connect(filter)
  filter.connect(master)
  master.connect(context.destination)

  return {
    agentId,
    master,
    oscillators,
    filter,
    motifTimer,
  } satisfies AmbientScoreHandle
}

const stopAmbientScore = async (fadeSeconds = 1.2) => {
  const context = await getAudioContext()

  if (!context || !activeAmbientScore) return

  const score = activeAmbientScore
  activeAmbientScore = null

  const now = context.currentTime
  score.master.gain.cancelScheduledValues(now)
  score.master.gain.setValueAtTime(Math.max(score.master.gain.value, 0.0001), now)
  score.master.gain.exponentialRampToValueAtTime(0.0001, now + fadeSeconds)

  window.setTimeout(() => {
    if (score.motifTimer !== null) {
      window.clearInterval(score.motifTimer)
    }
    score.oscillators.forEach((oscillator) => {
      try {
        oscillator.stop()
      } catch { }
      oscillator.disconnect()
    })
    score.filter.disconnect()
    score.master.disconnect()
  }, (fadeSeconds + 0.25) * 1000)
}

const transitionAmbientScore = async (agentId: AgentScoreId, token: number) => {
  if (!voiceRelayEnabled || token !== activeBroadcastToken) return

  const context = await getAudioContext()

  if (!context || token !== activeBroadcastToken) return
  if (activeAmbientScore?.agentId === agentId) return

  const nextScore = buildAmbientScore(context, agentId)
  const now = context.currentTime
  nextScore.master.gain.setValueAtTime(0.0001, now)
  nextScore.master.gain.exponentialRampToValueAtTime(0.09, now + 1.2)

  const previousScore = activeAmbientScore
  activeAmbientScore = nextScore

  if (previousScore) {
    previousScore.master.gain.cancelScheduledValues(now)
    previousScore.master.gain.setValueAtTime(Math.max(previousScore.master.gain.value, 0.0001), now)
    previousScore.master.gain.exponentialRampToValueAtTime(0.0001, now + 1.25)

    window.setTimeout(() => {
      if (previousScore.motifTimer !== null) {
        window.clearInterval(previousScore.motifTimer)
      }
      previousScore.oscillators.forEach((oscillator) => {
        try {
          oscillator.stop()
        } catch { }
        oscillator.disconnect()
      })
      previousScore.filter.disconnect()
      previousScore.master.disconnect()
    }, 1600)
  }
}

const playRadioCue = async (cue: 'summon' | 'agent' | 'close') => {
  const context = await getAudioContext()

  if (!context) return

  const now = context.currentTime
  const master = context.createGain()
  master.gain.value = 0.9
  master.connect(context.destination)

  const tone = context.createOscillator()
  tone.type = cue === 'agent' ? 'sine' : 'triangle'
  tone.frequency.setValueAtTime(cue === 'close' ? 320 : cue === 'agent' ? 640 : 880, now)
  tone.frequency.exponentialRampToValueAtTime(
    cue === 'summon' ? 510 : cue === 'agent' ? 570 : 190,
    now + (cue === 'summon' ? 0.16 : 0.12),
  )

  const toneGain = context.createGain()
  toneGain.gain.setValueAtTime(0.0001, now)
  toneGain.gain.exponentialRampToValueAtTime(cue === 'agent' ? 0.008 : 0.011, now + 0.015)
  toneGain.gain.exponentialRampToValueAtTime(0.0001, now + (cue === 'summon' ? 0.13 : 0.1))

  tone.connect(toneGain)
  toneGain.connect(master)

  const click = context.createOscillator()
  click.type = 'square'
  click.frequency.setValueAtTime(cue === 'close' ? 1600 : 2200, now)

  const clickGain = context.createGain()
  clickGain.gain.setValueAtTime(0.0001, now)
  clickGain.gain.exponentialRampToValueAtTime(0.0034, now + 0.004)
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022)

  click.connect(clickGain)
  clickGain.connect(master)

  tone.start(now)
  click.start(now)
  tone.stop(now + (cue === 'summon' ? 0.16 : 0.12))
  click.stop(now + 0.03)
}

const stopHtmlAudio = () => {
  if (!activeHtmlAudio) return

  activeHtmlAudio.pause()
  activeHtmlAudio.src = ''
  activeHtmlAudio = null
}

const setBroadcastState = (
  message: string,
  state: 'idle' | 'live' | 'muted' | 'unsupported',
) => {
  if (!broadcastCopy || !broadcastIndicator) return

  broadcastCopy.textContent = message
  broadcastIndicator.dataset.state = state
}

const setVoiceRelayEnabled = (enabled: boolean) => {
  voiceRelayEnabled = enabled && (audioPlaybackSupported || speechSupported)

  if (!broadcastToggle) return

  broadcastToggle.textContent = voiceRelayEnabled ? 'Voice relay on' : 'Voice relay off'
  broadcastToggle.setAttribute('aria-pressed', String(voiceRelayEnabled))

  if (!audioPlaybackSupported && !speechSupported) {
    broadcastToggle.disabled = true
    setBroadcastState('This browser does not support voice relay.', 'unsupported')
    return
  }

  if (voiceRelayEnabled) {
    setBroadcastState('Voice relay armed. The next answer will be carried as a voice.', 'idle')
  } else {
    if (speechSupported) {
      window.speechSynthesis.cancel()
    }
    stopHtmlAudio()
    void stopAmbientScore(0.5)
    setBroadcastState('Voice relay muted. The room will answer only on the page.', 'muted')
  }
}

const pickVoice = (agentId: string) => {
  if (!speechSupported) return null

  const voices = window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith('en'))

  if (!voices.length) return null

  const byName = (pattern: RegExp) => voices.find((voice) => pattern.test(voice.name))

  if (agentId === 'sheriff') {
    return byName(/david|mark|daniel|male|george|thomas/i) ?? voices[0]
  }

  if (agentId === 'activist') {
    return byName(/zira|aria|samantha|female|jenny|ava/i) ?? voices[1] ?? voices[0]
  }

  return byName(/guy|ryan|narrator|libby|sonia|jenny/i) ?? voices[2] ?? voices[0]
}

const speakPassage = async (
  text: string,
  agent: RitualAgent | { agent_id: string; display_name: string },
  token: number,
) => {
  if (!speechSupported || !voiceRelayEnabled || token !== activeBroadcastToken) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickVoice(agent.agent_id)

  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  } else {
    utterance.lang = 'en-US'
  }

  utterance.rate =
    agent.agent_id === 'activist' ? 1 : agent.agent_id === 'archivist' ? 0.95 : 0.92
  utterance.pitch =
    agent.agent_id === 'activist' ? 1.01 : agent.agent_id === 'archivist' ? 0.96 : 0.94
  utterance.volume = 1

  setBroadcastState(`${agent.display_name} is on the air.`, 'live')

  await new Promise<void>((resolve) => {
    const finish = () => {
      utterance.onend = null
      utterance.onerror = null
      resolve()
    }

    utterance.onend = finish
    utterance.onerror = finish
    window.speechSynthesis.speak(utterance)
  })
}

const playAudioPassage = async (
  audioUrl: string,
  agent: RitualAgent | { agent_id: string; display_name: string },
  token: number,
) => {
  if (!voiceRelayEnabled || token !== activeBroadcastToken) return

  stopHtmlAudio()

  const resolvedUrl = audioUrl.startsWith('http') ? audioUrl : `${apiOrigin}${audioUrl}`
  const audio = new Audio(resolvedUrl)
  audio.preload = 'auto'
  audio.volume = 0.58
  activeHtmlAudio = audio

  setBroadcastState(`${agent.display_name} is on the air.`, 'live')

  await new Promise<void>((resolve) => {
    const finish = () => {
      audio.onended = null
      audio.onerror = null
      if (activeHtmlAudio === audio) {
        activeHtmlAudio = null
      }
      resolve()
    }

    audio.onended = finish
    audio.onerror = finish
    void audio.play().catch(() => {
      finish()
    })
  })
}

const updatePointer = (event: PointerEvent) => {
  const { innerWidth, innerHeight } = window
  const x = (event.clientX / innerWidth - 0.5) * 2
  const y = (event.clientY / innerHeight - 0.5) * 2
  root.style.setProperty('--pointer-x', x.toFixed(3))
  root.style.setProperty('--pointer-y', y.toFixed(3))
}

const setupStageMotion = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d')

  if (!context) return

  const parent = canvas.parentElement

  if (!parent) return

  const beams = [
    { x: 0.18, width: 0.22, alpha: 0.18, speed: 0.0009, drift: 0.05, tilt: -0.18 },
    { x: 0.74, width: 0.28, alpha: 0.12, speed: 0.0006, drift: 0.07, tilt: 0.14 },
  ]

  const blooms = [
    { x: 0.16, y: 0.22, radius: 0.22, color: '255, 196, 133', speed: 0.00011, phase: 0.2 },
    { x: 0.82, y: 0.31, radius: 0.28, color: '153, 90, 54', speed: 0.00008, phase: 1.7 },
    { x: 0.48, y: 0.76, radius: 0.24, color: '255, 224, 176', speed: 0.00009, phase: 2.6 },
  ]

  const rivers = [
    { y: 0.72, height: 0.16, alpha: 0.18, speed: 0.00013, phase: 0.8 },
    { y: 0.84, height: 0.12, alpha: 0.12, speed: 0.00009, phase: 2.1 },
  ]

  let width = 0
  let height = 0
  let lastTime = 0

  const resize = () => {
    const rect = parent.getBoundingClientRect()
    const ratio = Math.min(window.devicePixelRatio || 1, 1.8)
    width = Math.max(1, Math.floor(rect.width))
    height = Math.max(1, Math.floor(rect.height))
    canvas.width = Math.floor(width * ratio)
    canvas.height = Math.floor(height * ratio)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
  }

  const drawBeam = (time: number, beam: (typeof beams)[number]) => {
    const drift = Math.sin(time * beam.speed + beam.x * 9) * beam.drift
    const beamX = (beam.x + drift) * width
    const beamWidth = beam.width * width

    context.save()
    context.translate(beamX, 0)
    context.transform(1, 0, beam.tilt, 1, 0, 0)
    const gradient = context.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, `rgba(255, 223, 177, ${beam.alpha})`)
    gradient.addColorStop(0.26, `rgba(255, 198, 133, ${beam.alpha * 0.68})`)
    gradient.addColorStop(0.7, `rgba(117, 71, 44, ${beam.alpha * 0.16})`)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    context.fillStyle = gradient
    context.fillRect(-beamWidth / 2, 0, beamWidth, height)
    context.restore()
  }

  const drawBloom = (time: number, bloom: (typeof blooms)[number]) => {
    const x = (bloom.x + Math.sin(time * bloom.speed + bloom.phase) * 0.04) * width
    const y = (bloom.y + Math.cos(time * bloom.speed * 1.2 + bloom.phase) * 0.03) * height
    const radius = bloom.radius * Math.min(width, height)
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, `rgba(${bloom.color}, 0.22)`)
    gradient.addColorStop(0.5, `rgba(${bloom.color}, 0.11)`)
    gradient.addColorStop(1, `rgba(${bloom.color}, 0)`)
    context.fillStyle = gradient
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
  }

  const drawRiver = (time: number, river: (typeof rivers)[number]) => {
    const y = river.y * height + Math.sin(time * river.speed + river.phase) * 18
    const glowHeight = river.height * height
    const gradient = context.createLinearGradient(0, y - glowHeight / 2, 0, y + glowHeight / 2)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(0.5, `rgba(255, 212, 158, ${river.alpha})`)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    context.fillStyle = gradient
    context.fillRect(width * 0.08, y - glowHeight / 2, width * 0.84, glowHeight)
  }

  const draw = (time: number) => {
    if (!width || !height) {
      resize()
    }

    if (!prefersReducedMotion && time - lastTime < 24) {
      window.requestAnimationFrame(draw)
      return
    }

    lastTime = time

    context.clearRect(0, 0, width, height)

    const background = context.createLinearGradient(0, 0, 0, height)
    background.addColorStop(0, 'rgba(45, 29, 20, 0.42)')
    background.addColorStop(0.48, 'rgba(26, 18, 14, 0.18)')
    background.addColorStop(1, 'rgba(10, 8, 7, 0.06)')
    context.fillStyle = background
    context.fillRect(0, 0, width, height)

    beams.forEach((beam) => drawBeam(time, beam))
    blooms.forEach((bloom) => drawBloom(time, bloom))
    rivers.forEach((river) => drawRiver(time, river))

    context.fillStyle = 'rgba(255, 233, 204, 0.045)'
    for (let index = 0; index < 26; index += 1) {
      const x = ((index * 97.2 + time * 0.02) % (width + 120)) - 60
      const y =
        (((index * 53.4 + Math.sin(time * 0.00015 + index) * 90) % (height + 160)) - 80)
      const size = 1.2 + (index % 3)
      context.beginPath()
      context.arc(x, y, size, 0, Math.PI * 2)
      context.fill()
    }

    if (!prefersReducedMotion) {
      window.requestAnimationFrame(draw)
    }
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(parent)
  resize()
  draw(0)

  if (!prefersReducedMotion) {
    window.requestAnimationFrame(draw)
  }

  window.addEventListener('resize', resize)
}

if (textarea && counter && preview) {
  const syncPreview = () => {
    const value = textarea.value.trim()
    counter.textContent = `${textarea.value.length} / 480`
    preview.textContent = value
      ? `"${value}"`
      : 'The room waits where the badge, the voice, and the threshold meet.'
  }

  textarea.addEventListener('input', syncPreview)
  syncPreview()
}

if (
  textarea &&
  knockButton &&
  requestStatus &&
  responsesShell &&
  responsesGrid &&
  responsesMeta &&
  transmissionStatus &&
  transmissionChamber &&
  broadcastToggle &&
  broadcastStop
) {
  const setPendingState = (pending: boolean) => {
    knockButton.disabled = pending
    knockButton.textContent = pending ? 'Summoning the council...' : 'Leave the badge'
  }

  const renderResponses = async (payload: RitualApiResponse) => {
    const broadcastToken = activeBroadcastToken
    responsesShell.classList.remove('is-loading')
    responsesGrid.innerHTML = ''
    resetEpilogueOverlay()
    transmissionStatus.hidden = false
    transmissionStatus.textContent = 'Signal acquired. The room is tuning its first voice.'
    setBroadcastState(
      voiceRelayEnabled
        ? payload.tts_mode === 'piper'
          ? 'Piper relay armed. The council will arrive as recorded voices.'
          : 'Voice relay armed. The room will speak in sequence.'
        : 'Voice relay muted. The room will answer only on the page.',
      voiceRelayEnabled ? 'idle' : 'muted',
    )

    const epilogueAgent = payload.agents.find((agent) => agent.agent_id === 'epilogue')
    const narrativeAgents = payload.agents.filter((agent) => agent.agent_id !== 'epilogue')

    for (const [index, agent] of narrativeAgents.entries()) {
      if (broadcastToken !== activeBroadcastToken) return

      if (voiceRelayEnabled) {
        await transitionAmbientScore(agent.agent_id as AgentScoreId, broadcastToken)
      }

      if (voiceRelayEnabled && radioCueSupported && payload.tts_mode !== 'piper') {
        await playRadioCue('agent')
      }

      const card = document.createElement('article')
      card.className = 'agent-response-card'
      card.dataset.agent = agent.agent_id
      if (agent.agent_id === 'archivist') {
        card.classList.add('is-closing-voice')
      }

      const label = document.createElement('p')
      label.className = 'card-label'
      label.textContent = agent.stance

      const crest = document.createElement('div')
      crest.className = 'agent-response-crest'

      const title = document.createElement('h3')
      title.className = 'agent-response-title'
      title.textContent = agent.display_name

      const body = document.createElement('p')
      body.className = 'agent-response-copy is-awaiting'

      card.append(label, crest, title, body)
      responsesGrid.append(card)
      await wait(prefersReducedMotion ? 120 : index === 0 ? 260 : 520)
      card.classList.add('is-visible')
      await wait(prefersReducedMotion ? 120 : 340)

      transmissionStatus.textContent =
        agent.agent_id === 'archivist'
          ? `${agent.display_name} is giving the room its last word.`
          : `${agent.display_name} has stepped into the frequency.`

      if (voiceRelayEnabled) {
        if (agent.audio_url) {
          await Promise.all([
            typeText(
              body,
              agent.message,
              broadcastToken,
              agent.agent_id === 'archivist' ? 'close' : 'measured',
            ),
            playAudioPassage(agent.audio_url, agent, broadcastToken),
          ])
        } else {
          await Promise.all([
            typeText(
              body,
              agent.message,
              broadcastToken,
              agent.agent_id === 'archivist' ? 'close' : 'measured',
            ),
            speakPassage(agent.message, agent, broadcastToken),
          ])
        }
      } else {
        await typeText(
          body,
          agent.message,
          broadcastToken,
          agent.agent_id === 'archivist' ? 'close' : 'measured',
        )
      }
    }

    if (broadcastToken !== activeBroadcastToken) return

    if (epilogueAgent && epilogueShell && epilogueQuote) {
      if (voiceRelayEnabled) {
        await transitionAmbientScore('epilogue', broadcastToken)
      }

      setEpilogueVisible(true)
      await wait(prefersReducedMotion ? 120 : 420)
      transmissionStatus.textContent = 'The coda is stepping forward to leave one last line.'
      await wait(prefersReducedMotion ? 120 : 420)

      if (voiceRelayEnabled) {
        if (epilogueAgent.audio_url) {
          await Promise.all([
            typeText(epilogueQuote, epilogueAgent.message, broadcastToken, 'epigram'),
            playAudioPassage(epilogueAgent.audio_url, epilogueAgent, broadcastToken),
          ])
        } else {
          await Promise.all([
            typeText(epilogueQuote, epilogueAgent.message, broadcastToken, 'epigram'),
            speakPassage(epilogueAgent.message, epilogueAgent, broadcastToken),
          ])
        }
      } else {
        await typeText(epilogueQuote, epilogueAgent.message, broadcastToken, 'epigram')
      }
    }

    responsesMeta.textContent = ''
    responsesShell.hidden = false
    transmissionStatus.textContent = 'The coda has left its last line in the room.'
    if (voiceRelayEnabled) {
      await stopAmbientScore(2.1)
      if (broadcastToken === activeBroadcastToken) {
        if (radioCueSupported && payload.tts_mode !== 'piper') {
          await playRadioCue('close')
        }
        setBroadcastState('Broadcast complete. The room has gone quiet again.', 'idle')
      }
    } else {
      setBroadcastState('The text has landed. The room remains silent.', 'muted')
    }
  }

  if (speechSupported) {
    window.speechSynthesis.getVoices()
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      if (voiceRelayEnabled) {
        setBroadcastState('Voice relay armed. The next answer will be carried as a voice.', 'idle')
      }
    })
  }

  setVoiceRelayEnabled(voiceRelayEnabled)

  broadcastToggle.addEventListener('click', () => {
    setVoiceRelayEnabled(!voiceRelayEnabled)
  })

  broadcastStop.addEventListener('click', () => {
    activeBroadcastToken += 1
    clearLoadingLoop()
    transmissionChamber.hidden = true
    transmissionChamber.classList.remove('is-live', 'is-resolving')
    void stopLoadingScan(0.15)
    responsesShell.classList.remove('is-loading')
    resetEpilogueOverlay()
    if (speechSupported) {
      window.speechSynthesis.cancel()
    }
    stopHtmlAudio()
    void stopAmbientScore(0.45)
    setBroadcastState('Signal cut. The relay has been silenced.', voiceRelayEnabled ? 'idle' : 'muted')
    transmissionStatus.textContent = 'Transmission paused by the listener.'
  })

  epilogueExit?.addEventListener('click', () => {
    closeEpilogue('responses')
  })

  epilogueRestart?.addEventListener('click', () => {
    closeEpilogue('top')
  })

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    if (!epilogueShell || epilogueShell.hidden) return

    closeEpilogue('responses')
  })

  knockButton.addEventListener('click', async () => {
    const confession = textarea.value.trim()

    if (confession.length < minimumConfessionLength) {
      requestStatus.textContent = `Write at least ${minimumConfessionLength} characters so the room has something to answer.`
      return
    }

    setPendingState(true)
    activeBroadcastToken += 1
    if (speechSupported) {
      window.speechSynthesis.cancel()
    }
    stopHtmlAudio()
    void stopAmbientScore(0.45)
    void stopLoadingScan(0.15)
    requestStatus.textContent = 'Your words are crossing the threshold.'
    responsesShell.hidden = false
    responsesShell.classList.add('is-loading')
    responsesGrid.innerHTML = ''
    resetEpilogueOverlay()
    transmissionStatus.hidden = true
    responsesMeta.textContent = ''
    startLoadingLoop(activeBroadcastToken)
    responsesShell.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })

    try {
      if (voiceRelayEnabled && radioCueSupported) {
        await playRadioCue('summon')
      }

      const response = await fetch(`${apiBaseUrl}/ritual/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confession }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const payload = (await response.json()) as RitualApiResponse
      await resolveLoadingLoop()
      responsesMeta.textContent = ''
      transmissionStatus.textContent = 'The threshold has answered.'
      requestStatus.textContent = 'Three voices answered, and one final line stayed behind.'
      await renderResponses(payload)
    } catch (error) {
      clearLoadingLoop()
      void stopLoadingScan(0.15)
      setLoadingCopy(
        'Transmission lost before the chamber could open.',
        'The line went dark before the council could form a full answer.',
      )
      transmissionChamber.classList.remove('is-live')
      transmissionChamber.hidden = false
      transmissionStatus.hidden = false
      responsesShell.classList.add('is-loading')
      resetEpilogueOverlay()
      requestStatus.textContent =
        'The chamber could not hold the line. Start the backend and try the ritual again.'
      transmissionStatus.textContent = 'The signal broke before the voices could take shape.'
      console.error(error)
    } finally {
      setPendingState(false)
    }
  })
}

window.addEventListener('pointermove', updatePointer)

if (stageMotionCanvas) {
  setupStageMotion(stageMotionCanvas)
}

if (introSteps.length && introLines.length) {
  const applyStep = (index: number) => {
    const safeIndex = Math.max(0, Math.min(index, introLines.length - 1))
    const progress = introLines.length > 1 ? safeIndex / (introLines.length - 1) : 0

    root.style.setProperty('--intro-progress', progress.toFixed(4))

    introLines.forEach((line, lineIndex) => {
      line.classList.toggle('is-active', lineIndex === safeIndex)
    })
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

      if (!visible) return

      const stepIndex = Number((visible.target as HTMLElement).dataset.step ?? 0)
      applyStep(stepIndex)
    },
    {
      threshold: [0.55, 0.7, 0.9],
      rootMargin: '0px 0px -10% 0px',
    },
  )

  introSteps.forEach((step) => observer.observe(step))
  applyStep(0)
}

if (thresholdStage) {
  const stageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        thresholdStage.classList.toggle('is-visible', entry.isIntersecting)
      })
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px',
    },
  )

  stageObserver.observe(thresholdStage)
}

if (introSection && thresholdStage && introSteps.length) {
  const syncIntroSnapMode = () => {
    const thresholdTop = thresholdStage.offsetTop
    const snapReleasePoint = thresholdTop - window.innerHeight * 0.18
    const snapActive = window.scrollY < snapReleasePoint

    document.documentElement.classList.toggle('intro-snap-active', snapActive)
    document.body.classList.toggle('intro-snap-active', snapActive)
  }

  syncIntroSnapMode()
  window.addEventListener('scroll', syncIntroSnapMode, { passive: true })
  window.addEventListener('resize', syncIntroSnapMode)
}
