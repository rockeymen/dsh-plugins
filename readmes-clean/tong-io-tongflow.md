![TongFlow](public/logo.svg)

  # TongFlow : An Open-Source Multi-Modal GenAI Workflow Studio



    <video src="https://github.com/user-attachments/assets/407a7e7b-2d44-4c90-8016-33d0a9f5e7d5"></video>


    English · [简体中文](docs/README_ZH.md) · [日本語](docs/README_JA.md)


## Demo Examples

### Workflow · Result
- **Workflow**: **Basic** — Type text (Add), generate images (Transform), then blend them into one (Compose).![workflow](https://file.tongflow.com/public/demos/basic.png) · **Result**: ![result](https://file.tongflow.com/public/demos/basic_result.png)
- **Workflow**: **Intermediate** — (Add topic → write script → generate speech) + (character description → generate image) → lip-synced video = talking-head avatar.![workflow](https://file.tongflow.com/public/demos/digitalhuman.png) · **Result**: <video src="https://github.com/user-attachments/assets/a803394d-0ccf-4023-9b06-5c1581345758" width="200"></video>
- **Workflow**: **Advanced** — Generate lyrics + song + characters + scenes + storyboard → produce a music video.![workflow](https://file.tongflow.com/public/demos/mv.png) · **Result**: <video src="https://github.com/user-attachments/assets/2bc71e3c-3ed6-48b2-81e7-82ad5976d801" width="200"></video>

With TongFlow, you can expand your imagination and stretch your ideas with generative AI, just have a try now!

## How To Start

The TongFlow **desktop app** is a lightweight (~10 MB) shell around the cloud studio at **[app.tongflow.com](https://app.tongflow.com)** — install it, sign in, and start creating. The cloud studio also runs in any modern browser.

### Step 1 — Install the desktop app

Download the installer for your platform, install it, and open it.

- **macOS (Universal — Apple Silicon & Intel):** [TongFlow-mac-universal.dmg](https://github.com/tong-io/tongflow/releases/latest/download/TongFlow-mac-universal.dmg)
- **Windows:** [TongFlow-win-x64.msi](https://github.com/tong-io/tongflow/releases/latest/download/TongFlow-win-x64.msi)

All builds are on the [Releases](https://github.com/tong-io/tongflow/releases/latest) page.

> **macOS:** the builds are not yet notarized with Apple, so Gatekeeper will block the first launch ("TongFlow is damaged and can't be opened"). After moving the app to Applications, clear the quarantine flag once and it opens normally:
>
> ```bash
> xattr -cr /Applications/TongFlow.app
> ```
>
> Download from this page directly — installers passed through chat apps (e.g. WeChat) may be renamed or re-flagged.

### Step 2 — Sign in and create

Sign in with Google or WeChat and start creating — the cloud studio manages plugins and execution for you.

> **Prefer a fully local, account-free TongFlow?** That's what self-hosting is for — see [Run from source](#run-from-source) or [Run with Docker](#run-with-docker), then follow [Self-host setup](#self-host-setup-plugins--credentials). (The desktop app up to v0.1.13 bundled this local runtime; those installers remain on the [Releases](https://github.com/tong-io/tongflow/releases) page.)

## Core Concept

- **All models**: AI models can be thought of as a **modality transform** (e.g. LLMs are text→text, image models are text→image, speech models are text→audio, and so on). TongFlow wraps each capability as a node.

- **All modalities**: TongFlow supports almost every modality and file format that people actually ship over the web.

- **Low barrier, high ceiling**: no complex AI parameters to learn, no manual node connecting; just three operations — **add**, **transform**, and **combine** — to arrange ideas freely. And by orchestrating AI models freely, you can generate unique creations and works of your own.

- **Open ecosystem**: TongFlow's plugin-based design lets every platform package its own independent plugins, and we provide at least one official implementation plugin for each capability node. The core stays small, the ecosystem stays open.

## What’s Defined

> ✅ = available out of the box with an official plugin · ⬜ = node exists in the canvas but has no official plugin yet (planned).

### Add

- ✅ **Text input**: type text and add a text node.
- ✅ **Add image**: pick a local file and add an image node.
- ✅ **Add photo**: capture with the device camera and add an image node.
- ✅ **Add sketch**: draw on the canvas and add an image node.
- ✅ **Add audio**: pick a local audio file and add an audio node.
- ✅ **Record audio**: record with the mic and add an audio node.
- ✅ **Add video**: pick a local video file and add a video node.
- ✅ **Record video**: record with the camera and add a video node.
- ✅ **Add document**: pick a local file and add a document node.
- ✅ **Add URL**: fetch a page from a link and add text, image, audio, or video nodes.
- ✅ **Add 3D model**: choose a local model file and add a 3D model node.

### Transform

#### Text

- ✅ **Generate / rewrite**: create or edit copy from a prompt.

#### Image

- ✅ **Image generation**: images from text.
- ✅ **Image editing**: inpaint, edit, or redraw with instructions.
- ✅ **Image understanding**: captions, Q&A, or descriptions from an image.
- ✅ **Image upscaling**: enlarge for sharper detail.
- ✅ **Pose detection**: 308-keypoint whole-body skeleton overlay (body, hands, face).
- ✅ **Body-part segmentation**: 29-class human parsing overlay.
- ✅ **Surface normals**: per-pixel normal map — human-centric or full scene.
- ✅ **Matting**: cut the human or salient foreground out as a transparent PNG.

#### Video

- ✅ **Video generation**: video from text.
- ✅ **Image-to-video**: animate a still into motion.
- ✅ **First/last-frame video**: two key images to interpolate a clip.
- ✅ **Images → video**: multi-image reference fusion — several reference images plus text into a new video.
- ✅ **Omni-reference video**: mix image, video, and audio references (plus text) into one video with native stereo audio.
- ✅ **Video understanding**: summaries or descriptions from video.
- ✅ **Video upscaling**: higher-resolution output.
- ✅ **Extract first / last frame**: grab a frame as an image.
- ✅ **Video editing**: edit a video from a text instruction.
- ✅ **Subtitle removal**: clean subtitles from a video.
- ✅ **Watermark removal**: remove watermarks from a video.

#### Audio

- ✅ **Music generation**: music from text, with optional reference-audio conditioning.
- ✅ **Audio understanding**: describe a clip (music, speech, or ambient sound) in text.
- ✅ **Music repaint**: regenerate a chosen time range of a song.
- ✅ **Music cover**: restyle a song via a caption and/or a reference track.
- ✅ **Add track / complete arrangement**: generate one new stem over a mix, or fill in missing tracks.
- ✅ **Music brief**: one-sentence idea → lyrics, style tags, BPM, key, and duration.
- ✅ **Speech synthesis**: text-to-speech — preset style, voice clone (reference audio), or instruction-driven.
- ✅ **Speech recognition**: transcribe speech from audio or video.
- ✅ **Noise reduction**: denoise audio.
- ⬜ **Speaker diarization**: separate audio by speaker.
- ⬜ **Voice / timbre replacement**: replace or clone a voice with a reference sample.
- ✅ **Multi-track / vocal-accompaniment separation**: isolate vocals, drums, bass, guitar, and 8 more stems.
- ✅ **Open-vocabulary sound separation**: describe any sound in words ("dog barking") and split the audio into that sound and everything else.

### Combine

- ✅ **Image fusion**: blend or edit multiple references into one image.
- ✅ **Lip sync**: audio + video → video (lip-sync); also audio + image → video and audio + text → video variants.
- ✅ **Emotive speech**: text + voice reference → speech in that voice, with emotion control.
- ✅ **Character swap**: video + reference (scene blend / character replacement), Animate Mix-style generation.
- ✅ **Motion transfer**: video + reference (motion / retarget), Animate Move-style generation.
- ✅ **Combine text**: merge multiple text nodes into one.

### Other

- ✅ **Image → 3D**: single-view 3D model from an image.
- ✅ **Video → motion capture**: monocular video to skeletal animation (body + fingers + face channels, GLB).
- ✅ **Document → text**: extract plain text from documents.
- ✅ **Link → text**: turn page content into text.

### Helpers

- ✅ **Concatenate clips**: join multiple videos end to end.
- ✅ **Mux audio + video**: merge into one file.
- ✅ **Split by shots**: cut a long video into segments by scene.
- ✅ **Split video & audio**: demux a video into separate video and audio tracks.
- ✅ **Extract audio track**: pull audio into its own asset.
- ✅ **Split long text**: break a long passage into chunks.
- ✅ **Merge / tidy text blocks**: combine segments (use the auto-merge option).
- ✅ **Filter or drop clips**: drop unwanted clips by rule or selection.
- ✅ **Arrange & batch groups**: group and arrange text/clip batches for downstream processing.

## Official plugins

> The official GPU/CPU plugins currently run on [Modal](https://modal.com) — up to **$30/month** of free GPU compute (H100/A100, etc.). See [Self-host setup](#self-host-setup-plugins--credentials) for the `MODAL_TOKEN_*` setup. Any other platform can publish its own plugins the same way.

### API plugins

First-party providers (a lab's own models):

- [tongflow-api-gemini](https://github.com/tong-io/tongflow-api-gemini) — Google Gemini with a per-node **model picker**: text, vision, image (Nano Banana / Imagen 4), Veo video, TTS and transcription
- [tongflow-api-openai](https://github.com/tong-io/tongflow-api-openai) — OpenAI with a per-node **model picker**: `gen_text`, image gen/edit/fusion (`gpt-image-2`), vision, document OCR, Whisper transcription and TTS
- [tongflow-api-deepseek](https://github.com/tong-io/tongflow-api-deepseek) — DeepSeek V4 (`flash` / `pro`, with a streaming **thinking** bubble) for `gen_text` / text tools
- [tongflow-api-bytedance](https://github.com/tong-io/tongflow-api-bytedance) — ByteDance Volcengine Ark with a per-node **model picker**: Doubao text & vision, Seedream image gen/edit/fusion, Seedance text/image/audio → video
- [tongflow-api-xai](https://github.com/tong-io/tongflow-api-xai) — xAI Grok with a per-node **model picker**: `gen_text` (Grok 4.x), image understanding, and Grok Imagine text-to-image
- [tongflow-api-runway](https://github.com/tong-io/tongflow-api-runway) — Runway Dev unified API with a per-node **model picker**: video (Gen-4.5, Gen-4 Turbo, Aleph edit, Act-Two, Seedance, Veo), image (GPT Image 2, Seedream 5, Gemini image 3) and ElevenLabs TTS

### Router plugins

Aggregators — one key, many third-party models across labs:

- [tongflow-router-openrouter](https://github.com/tong-io/tongflow-router-openrouter) — OpenRouter with a per-node **model picker**: `gen_text` (free by default, plus GPT-5.5 / Claude / Gemini / Grok / DeepSeek), vision / audio understanding, image gen/edit and transcription
- [tongflow-router-cometapi](https://github.com/tong-io/tongflow-router-cometapi) — CometAPI gateway with a per-node **model picker** that also lists CometAPI's **live catalog**: `gen_text` / text tools (GPT-5.5, Claude, Gemini, DeepSeek, Grok, Qwen, Kimi), image / video / audio understanding, image gen/edit/fusion (GPT Image 2, Seedream), text / image(s) → video (Sora 2, Veo 3.1, Seedance, Wan, MiniMax, HappyHorse, Vidu), video edit (Omni), TTS and Whisper transcription
- [tongflow-router-toapis](https://github.com/tong-io/tongflow-router-toapis) — ToAPIs gateway with a per-node **model picker**: `gen_text` / text tools (GPT-5.6, Claude, Gemini, DeepSeek, Qwen, GLM, Kimi, MiniMax), image understanding, image gen/edit/fusion (GPT Image 2, Seedream 5, Gemini Image, Flux 2, Grok), text / image(s) / first-last-frame / multimodal refs → video (Sora 2, Veo 3.1, Seedance 2, Kling, MiniMax H3, Wan, HappyHorse, Vidu), video edit (HappyHorse); the picker also lists the **live per-key model list**
- [tongflow-router-apimart](https://github.com/tong-io/tongflow-router-apimart) — APIMart gateway with a per-node **model picker**: image gen/edit (Z-Image, Seedream, Nano Banana, GPT-Image), text/image → video (Kling, VEO3, Sora2, Seedance), `gen_text` (GPT-5, Claude, Gemini), Whisper transcription and TTS
- [tongflow-router-replicate](https://github.com/tong-io/tongflow-router-replicate) — Replicate with a per-node **model picker** across the catalog: text, vision, image gen/edit/fusion/upscale/matting, text/image → video, transcription, TTS / voice clone, music, and image → 3D (FLUX, Seedream, Veo, Kling, Whisper, Hunyuan3D…)
- [tongflow-router-fal](https://github.com/tong-io/tongflow-router-fal) — fal.ai with a per-node **model picker**: image (gen/edit/fusion/upscale/matting/pose/normal/seg), video (text/image → video, first-last frame, talking-head, lip-sync, upscale), audio (transcription, TTS, voice clone, music, source separation) and image → 3D

### GPU/CPU plugins

- [tongflow-modal-ffmpeg](https://github.com/tong-io/tongflow-modal-ffmpeg) — transcoding, muxing, media pipelines
- [tongflow-modal-pyscenedetect](https://github.com/tong-io/tongflow-modal-pyscenedetect) — shot-boundary detection for splitting clips
- [tongflow-modal-z-image](https://github.com/tong-io/tongflow-modal-z-image) — Z-Image text-to-image
- [tongflow-modal-ernie-image](https://github.com/tong-io/tongflow-modal-ernie-image) — ERNIE Image text-to-image (alternative)
- [tongflow-modal-krea2](https://github.com/tong-io/tongflow-modal-krea2) — Krea 2 Turbo text-to-image (open-weights 12B, 8-step, up to 2K)
- [tongflow-modal-flux2-klein9b](https://github.com/tong-io/tongflow-modal-flux2-klein9b) — FLUX.2 Klein 9B multi-reference fusion / image editing
- [tongflow-modal-boogu](https://github.com/tong-io/tongflow-modal-boogu) — Boogu-Image-0.1 (fp8) text-to-image (dense bilingual text) & single-reference image editing
- [tongflow-modal-infinitetalk](https://github.com/tong-io/tongflow-modal-infinitetalk) — InfiniteTalk audio-driven lip-sync (audio + image / video → talking-head video)
- [tongflow-modal-wan-animate](https://github.com/tong-io/tongflow-modal-wan-animate) — Wan-Animate character swap & motion transfer (video + reference)
- [tongflow-modal-scail2](https://github.com/tong-io/tongflow-modal-scail2) — SCAIL-2 controlled character animation (image + driving video; same two slots as wan-animate)
- [tongflow-modal-minimax-h3](https://github.com/tong-io/tongflow-modal-minimax-h3) — MiniMax-H3 33B video generation with native stereo audio (text / first- & last-frame / multi-image / omni-reference)
- [tongflow-modal-bernini](https://github.com/tong-io/tongflow-modal-bernini) — Bernini-R 1.3B unified video renderer (text/image → image/video, video editing, subtitle / watermark removal)
- [tongflow-modal-sam3](https://github.com/tong-io/tongflow-modal-sam3) — SAM 3 / SAM 3.1 text-guided matting: cut every instance of a described concept out of an image (transparent PNG) or track it through a video (green-screen matte)
- [tongflow-modal-triposplat](https://github.com/tong-io/tongflow-modal-triposplat) — TripoSplat single image → 3D Gaussian splat
- [tongflow-modal-sam-3d-objects](https://github.com/tong-io/tongflow-modal-sam-3d-objects) — SAM 3D Objects single image → 3D Gaussian splat of the foreground object (auto mask, robust to occlusion/clutter; alternative)
- [tongflow-modal-sam-3d-body](https://github.com/tong-io/tongflow-modal-sam-3d-body) — SAM 3D Body single image → full-body 3D human mesh GLB (multi-person, MHR rig; alternative), and **video motion capture** (per-frame MHR regression → animated character GLB; alternative)
- [tongflow-modal-sapiens2](https://github.com/tong-io/tongflow-modal-sapiens2) — Sapiens2 (Meta) human suite: pose detection, body-part segmentation, surface normals, human matting, image → 3D point cloud, and **video motion capture** (geometric engine: keypoints + pointmap → animated MHR character GLB)
- [tongflow-modal-sensenova-vision](https://github.com/tong-io/tongflow-modal-sensenova-vision) — SenseNova-Vision (SenseTime) unified vision model: image understanding / visual QA, detection & OCR structured text, full-scene surface normals, salient-object matting, and human pose overlay (alternative)
- [tongflow-modal-seedvr2](https://github.com/tong-io/tongflow-modal-seedvr2) — SeedVR2 image / video super-resolution
- [tongflow-modal-gemma4](https://github.com/tong-io/tongflow-modal-gemma4) — Gemma-4 multimodal text (image / video understanding)
- [tongflow-modal-qwen38](https://github.com/tong-io/tongflow-modal-qwen38) — Qwen3.8-27B multimodal text (text generation, image / video understanding; alternative)
- [tongflow-modal-qwen3asr](https://github.com/tong-io/tongflow-modal-qwen3asr) — Qwen3 speech recognition
- [tongflow-modal-qwen3tts](https://github.com/tong-io/tongflow-modal-qwen3tts) — Qwen3 text-to-speech
- [tongflow-modal-indextts2](https://github.com/tong-io/tongflow-modal-indextts2) — IndexTTS-2.5 emotive text-to-speech: zero-shot voice cloning (alternative) and emotion-controlled speech from a voice reference
- [tongflow-modal-whisper](https://github.com/tong-io/tongflow-modal-whisper) — Whisper speech recognition with timestamps (alternative)
- [tongflow-modal-ace-step](https://github.com/tong-io/tongflow-modal-ace-step) — ACE-Step 1.5 music suite: text-to-music (sft / base / turbo selectable), repaint, cover, stem extraction, add-track, arrangement completion, music brief, and music understanding
- [tongflow-modal-levo](https://github.com/tong-io/tongflow-modal-levo) — LeVo 2 / SongGeneration text-to-music (multilingual, commercial-grade)
- [tongflow-modal-minimax-music3](https://github.com/tong-io/tongflow-modal-minimax-music3) — MiniMax-Music3 11B song generation: lyrics + description → complete song with vocals (up to ~5 min, 32 kHz stereo)
- [tongflow-modal-sam-audio](https://github.com/tong-io/tongflow-modal-sam-audio) — SAM-Audio text-prompted sound separation: noise reduction, vocal isolation, and free-text stem extraction ("the piano in the background")
- [tongflow-modal-docling](https://github.com/tong-io/tongflow-modal-doclin