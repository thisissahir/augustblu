# RUMI STATE
home: C:\Users\GE66\Desktop\AUGUST BLU\RUMI AND TEAM
last_run: 2026-07-06 20:58
today_at_last_run: 2026-07-06

## Timeline (all dated items, chronological)
_Source of truth is the artist OS. Pull the live dates in on the next working run; nothing invented here._
| date | kind | item | status | notes |
|------|------|------|--------|-------|
| — | — | (sync from OS) | — | confirm calendar, rollout beats, dated tasks, EP target |

## Overdue (address first)
- None recorded yet. On the next run, compare every dated item against today and list slips here first.

## Posting plan
Arc: to confirm from the OS.
| date | bucket | platform | format | hook | status |
|------|--------|----------|--------|------|--------|
| — | — | — | — | (sync from OS) | — |

## Rollout
Spine: to confirm from the OS.
### TEASE (date range)
- (sync)
### DROP (date range)
- (sync)
### SUSTAIN (date range)
- (sync)
Assets to film ahead: to confirm.
Convert moves (email/SMS): drive to augustblu.com list.

## Demos (release assets: website + streaming)
_New in the OS: single / EP / music video, tracked idea → recorded → mixed → mastered → on website → on streaming → live._
| title | type | stage | website link | streaming link | note |
|-------|------|-------|--------------|----------------|------|
| — | — | — | — | — | (sync from OS Demos tab) |

## EP pipeline
Title: Better Days | Target: to confirm | Overall: to confirm | Released: to confirm
| # | track | stage (idea/writing/demo/tracking/mix/master/released) | note |
|---|-------|--------|------|
| 1 | Tinted Windows | confirm | Space Cat (Tamzid) + Madbus (Cyril) record; Sahir writes/produces/mix/master/visual |
| 2 | Away a Way | confirm | " |
| 3 | All is Love | confirm | " |
| 4 | Open | confirm | " |

## Socials (posted on Instagram)
_New in the OS: log each post with date, bucket, format, hook, URL, and likes/comments/saves. Cadence chart lives in the OS._
| date | bucket | format | hook | likes | comments | saves |
|------|--------|--------|------|-------|----------|-------|
| — | — | — | (sync from OS Socials tab) | — | — | — |

## Home
RUMI lives in `C:\Users\GE66\Desktop\AUGUST BLU\RUMI AND TEAM`. This is his working directory: read and rewrite `RUMI-STATE.md` here on every run, and keep his private `rumi-watch` skill and any team files here. Everything RUMI owns stays under this folder.

## Capabilities
Tools RUMI can now reach for, beyond drafting and planning.

- **/watch (claude-video 0.2.0) — PRIVATE TO RUMI** — RUMI can watch a video and answer questions about it. Give it a URL (YouTube, Vimeo, TikTok) or a local file path, plus an optional question. This capability is his alone: it is packaged as `rumi-watch` with an access gate, and no other agent or the base assistant may run it.
  - How it works: pulls native captions first, downloads with yt-dlp, extracts scene-aware frames with ffmpeg, transcribes via Whisper API as fallback, then reads the frames + transcript.
  - Detail dial: `transcript` (captions only, no frames), `efficient` (fast keyframes, cap 50), `balanced` (scene-aware, cap 100, default), `token-burner` (scene-aware, uncapped). Extra flags: `--timestamps T1,T2,…`, `--no-whisper`, `--no-dedup`, `--max-frames N`.
  - Needs `ffmpeg`, `ffprobe`, `yt-dlp` installed; a Whisper API key is encouraged but optional (keyless runs frames-only).
  - Invoke: `/watch <video-url-or-path> [question]`.
  - Use it for August Blu work: read a reference reel to name why its hook lands; break down a competitor's or influence's music video shot by shot for the one-man locked-camera constraint; review Sahir's own rough footage before it's cut; pull the beat structure and on-screen text off a trend before deciding whether it fits the brand; time-stamp the exact moment a clip should start for the hook. Frames + transcript feed straight into the DIRECT and REPURPOSE drafts.
  - Boundary: RUMI watches and reports. He never posts, downloads for redistribution, or publishes anything. Sahir approves and ships.

## Memory (long-term, one sentence each)
- [fact] RUMI can now watch videos via the /watch skill (claude-video 0.2.0), packaged as the private `rumi-watch`: pass a URL or local path and an optional question, and he reads frames plus transcript to analyze the footage.
- [decision] The watch capability is exclusive to RUMI. It is gated so no other agent (Forge, Apollo, Orion, Dharma, Zeus, Karma, Polaris, Sirius, Hermes, Atlas) and not the base assistant can trigger it; a non-RUMI request gets refused, not served.
- [decision] Default /watch detail is `balanced`; drop to `transcript` when only the words matter and reach for `token-burner` only when every scene-change frame is needed.
- [fact] August Blu's EP is titled Better Days; confirmed tracks are Tinted Windows, Away a Way, All is Love, and Open.
- [fact] Space Cat (Tamzid) and Madbus (Cyril) handle recording; Sahir owns writing, producing, mix/master, and all visual.
- [preference] All output: no em dashes, no hype, actual content over descriptions, first executable step named at the end.
- [fact] Production constraint is a one-man locked-tripod camera in Denver/Colorado light; the stillness is the signature, so video analysis is judged against that constraint, not against crewed shoots.
- [note] The OS now has a Demos pipeline (website + streaming) and a Socials post log; mirror both into this file each run.
- [fact] RUMI's home folder is C:\Users\GE66\Desktop\AUGUST BLU\RUMI AND TEAM; RUMI-STATE.md and the private rumi-watch skill live there, and every run reads and rewrites the state file in that folder.

## Changelog
- 2026-07-06 20:58: Set RUMI's home folder to C:\Users\GE66\Desktop\AUGUST BLU\RUMI AND TEAM. Recorded it in the header, a new Home section, and Memory; this is where the state file and the rumi-watch skill live and where every run reads/writes.
- 2026-07-06 20:52: Made the watch capability private to RUMI. Repackaged it as `rumi-watch` with a hard access gate (user-invocable off, description scoped to RUMI-only triggers, in-body gate that refuses any non-RUMI run). Updated Capabilities and Memory to record the exclusivity.
- 2026-07-06 20:45: State file created on this run. Learned the /watch video capability (claude-video 0.2.0) and recorded it under Capabilities and Memory. Seeded stable August Blu facts (EP Better Days + tracklist, collaborators, production constraint). Left dated tables (timeline, plan, rollout, demos, socials, EP stages) marked to sync from the live OS so no progress or dates are invented; next run should pull those in and list any overdue items first.
