# aria

> **Modern C++20 MVVM framework — cross-platform, layered, coroutine-first.**
>
> Targets Windows / macOS / Linux / iOS / Android / Web with a single shared core.

## Why

Existing C++ MVVM offerings either drag in a giant UI framework (Qt is 100+ MB),
glue you to a single platform, or hide behind macros. **aria** is the opposite:

- A small **header-only core** built on one unified **reactive dependency
  graph** (push-color + pull-evaluate). `Property<T>` / `Computed<T>` /
  `Effect` / `Command<>` / `ObservableList<T>` / `Validator<T>` all share
  the same engine — Computed is auto-tracking (no explicit deps), and
  `reactive::batch` / `reactive::untracked` give you fine control when you
  need it.
- A **type-erased ABI layer** so non-template parts of the framework can ship
  as proper shared libraries. `aria-abi` / `aria-runtime` / `aria-binding`
  (non-template exports) are ABI-stable within a major version; template layers
  (`aria-core` / `aria-async`) are source-compatible only.
- A **C++20 coroutine** layer (`Task<T>`, executors, `co_await schedule_on(pool)`) —
  treat asynchronous work like local code.
- An adapter abstraction (`IViewAdapter`) so any UI toolkit — Qt6, AppKit, UIKit,
  JNI/Compose, Emscripten/WebAssembly — can host your view-models with the
  *same business logic*.

## Architecture (10 modules)

```
┌────────────────────────────────────────────────────────────────────────┐
│                         Application                                    │
└────────────────────────────────┬───────────────────────────────────────┘
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │ Qt6 adapter  │    │ JNI adapter  │    │ HTTP adapter │     (optional
   │ (Win/Mac/Lin)│    │  (Android)   │    │ REST/SSE Web │      modules;
   │ AppKit/UIKit │    │              │    │ WASM planned │      opt-in)
   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
          └───────────────────┴───────────────────┘
                              ▼
              ┌─────────────────────────────────┐
              │    aria-binding  (SHARED)       │
              │  BindingEngine + IViewAdapter   │
              └────────────────┬────────────────┘
                               │
        ┌──────────────────────┴───────────────────────┐
        ▼                                              ▼
┌───────────────────┐                       ┌────────────────────┐
│ aria-runtime      │                       │  aria-async        │
│ (SHARED .dylib)   │                       │   (header-only)    │
│ EventBus          │                       │ Task<T>            │
│ Container         │                       │ Scheduler          │
│ Dispatcher        │                       │ Executor           │
│ Logger            │                       │ schedule_on        │
└───────┬───────────┘                       └─────────┬──────────┘
        └──────────────────┬─────────────────────────—┘
                           ▼
              ┌─────────────────────────────┐
              │ aria-core  (header-only)    │
              │ Property / Computed / Cmd   │
              │ ObservableList / Validator  │
              │ Subscription                │
              └──────────────┬──────────────┘
                             ▼
              ┌─────────────────────────────┐
              │  aria-abi  (STATIC .a)      │
              │ Type-erased Signal/Slot     │
              │ ABI-stable, no templates    │
              └─────────────────────────────┘
```

### Module · Type · Depends on · Notes
- **Module**: `aria-abi` · **Type**: `STATIC` · **Depends on**: none · **Notes**: Type-erased signal/slot. No templates. **ABI-stable.**
- **Module**: `aria-core` · **Type**: header-only · **Depends on**: abi · **Notes**: All the templates: `Property`, `Computed`, `Command`, `ObservableList`, `Validator`. Source-compatible only (not ABI-stable).
- **Module**: `aria-async` · **Type**: header-only · **Depends on**: core · **Notes**: C++20 `Task<T>`, executors. Source-compatible only.
- **Module**: `aria-runtime` · **Type**: `SHARED` · **Depends on**: core, abi · **Notes**: EventBus / Container / Dispatcher / Logger — singletons live in **one** dylib. **ABI-stable** (non-template exports).
- **Module**: `aria-binding` · **Type**: `SHARED` · **Depends on**: core, runtime · **Notes**: `BindingEngine`, `IViewAdapter`. **ABI-stable** (non-template exports).
- **Module**: Adapters · **Type**: `SHARED`/`STATIC` · **Depends on**: binding · **Notes**: Qt6 / AppKit / UIKit / JNI / HTTP (each opt-in); WASM is planned.

## Requirements

- **CMake** >= 3.20
- **Compiler** with full C++20 support:
  - GCC >= 12 (the MSYS2 UCRT64 toolchain on Windows)
  - Clang >= 15 (AppleClang 15+ on macOS/iOS)
  - **MSVC v143 / Visual Studio 2022** (Windows, see below)
- *(optional)* **Qt6** >= 6.4 (for Qt6 adapter and GUI examples)

> **Windows is supported on two toolchains: MSYS2 UCRT64 (GCC) and
> MSVC / Visual Studio 2022.** Pick whichever fits your team's existing
> stack — both build the full framework + tests + adapters from a single
> tree, no source forks. See ["Windows toolchains"](#windows-toolchains) below.

## Quick start

```bash
git clone https://github.com/dqsjqian/Aria.git
cd Aria
cmake -B build/flavors/release -DCMAKE_BUILD_TYPE=Release
cmake --build build/flavors/release -j
ctest --test-dir build/flavors/release --output-on-failure
```

> `build/` is a *container* for build trees — never configure straight into
> it. The unified layout (flavors / ide / platforms / examples / dist) is
> documented at the top of [`scripts/build.sh`](scripts/build.sh); the
> per-flavor script `scripts/build.sh [release|debug|asan|tsan]` picks the
> right directory for you.

> First configure pulls [doctest](https://github.com/doctest/doctest) via the
> bundled `CPM.cmake`. After that everything is offline.

### One-liner build scripts

```bash
# macOS / Linux
scripts/build.sh             # release
scripts/build.sh tests       # release + ctest
scripts/build.sh asan        # debug + AddressSanitizer + UBSan
scripts/build.sh tsan        # debug + ThreadSanitizer
scripts/build.sh clean

# Windows — MSYS2 UCRT64 (GCC + Ninja)
scripts\build.ps1            # release
scripts\build.ps1 tests
scripts\build.ps1 asan

# Windows — MSVC / Visual Studio 2022
scripts\build-msvc.ps1       # release  (build/flavors/msvc/ tree)
scripts\build-msvc.ps1 tests
scripts\build-msvc.ps1 debug
scripts\build-msvc.ps1 asan  # /fsanitize=address (no UBSan on MSVC)
```

### Windows toolchains

Aria ships with **two parallel build scripts** for Windows. They live
side-by-side in `scripts/`, write to separate build directories, and
neither one needs to know about the other.

### Toolchain · Script · Build dir · Notes
- **Toolchain**: **MSYS2 UCRT64** (GCC 14+ / Clang 18+) · **Script**: `scripts\build.ps1` · **Build dir**: `build/` · **Notes**: Lightweight (~300 MB). Pre-installed on most CI images. Auto-detected from `C:\msys64\ucrt64\bin` and a few other common paths.
- **Toolchain**: **MSVC v143** (VS 2022) · **Script**: `scripts\build-msvc.ps1` · **Build dir**: `build/flavors/msvc/` · **Notes**: Auto-detects the VS install via `vswhere`, scrubs MSYS2 env vars (`INCLUDE` / `LIB` / `CPATH` / ...) before running CMake, and uses the `Visual Studio 17 2022` generator.

You can switch back and forth without `clean` — the two trees are
isolated. CI runs both nightly to make sure neither regresses.

#### MSVC one-time setup

```powershell
# 1. Install Visual Studio 2022 Build Tools (or the full IDE) with
#    workload "Desktop development with C++" + "C++ CMake tools".
# 2. (Optional) install Qt 6 with the msvc2022_64 kit if you need the
#    Qt6 adapter / Qt showcase.
# 3. From any PowerShell window:
scripts\build-msvc.ps1 tests
```

#### MSYS2 one-time setup

```powershell
# 1. Install MSYS2 from https://www.msys2.org
# 2. Open the "MSYS2 UCRT64" shell:
pacman -Syu
pacman -S --needed mingw-w64-ucrt-x86_64-toolchain `
                   mingw-w64-ucrt-x86_64-cmake `
                   mingw-w64-ucrt-x86_64-ninja git
# 3. (Optional) Add C:\msys64\ucrt64\bin to your PATH.
# 4. From any shell:
scripts\build.ps1 tests
```

Rationale for shipping both: aria is coroutine-heavy C++20 code that
libstdc++, libc++, **and** the MSVC STL all handle cleanly. Pinning a
single Windows toolchain artificially excluded a large chunk of users
in the .NET / Visual Studio ecosystem — we now validate against MSVC
v143 on the same release gate as macOS, Ubuntu, and MSYS2.

### Use it from your own project

**Option A — `find_package` after install** (recommended for production):

```bash
# In the aria tree:
cmake -S . -B build/flavors/release -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr/local
cmake --build build/flavors/release -j && sudo cmake --install build/flavors/release
```

```cmake
# In your project's CMakeLists.txt:
find_package(aria 1.0 REQUIRED)
add_executable(my_app main.cpp)
target_link_libraries(my_app PRIVATE aria::aria)
# or pick individual modules: aria::core / ::async / ::runtime / ::binding
```

**Option B — vendored (no install)**:

```cmake
add_subdirectory(third_party/aria EXCLUDE_FROM_ALL)
target_link_libraries(my_app PRIVATE aria::core aria::async)
```

A ready-to-copy template lives in [`templates/quickstart/`](templates/quickstart/).

### Examples

aria ships runnable examples covering **every supported UI toolkit**, plus
headless console examples that exercise the core with no GUI.

**UI showcases — one per toolkit:**

### # · Project · Toolkit · Build · What it shows
- **#**: 1 · **Project**: **qt-showcase** · **Toolkit**: Qt6 (Widgets) · **Build**: CMake (`ARIA_BUILD_QT6=ON`) · **What it shows**: The **flagship demo**: one app, nine tabs, every public feature of the framework — reactive Property/Computed/Effect, Commands, ObservableList + QAbstractListModel, Validator, `Task<T>` + executors, cancellation, retry, `when_all`, EventBus, DI Container, Dispatcher, navigation, two-way binding.
- **#**: 2 · **Project**: **macos-appkit-mvvm** · **Toolkit**: macOS AppKit (ObjC++) · **Build**: Xcode · **What it shows**: Self-contained Xcode project using `aria` from Objective-C++: an `IViewAdapter` over `NSTextField`/`NSButton`, the same ViewModel driving native AppKit controls.
- **#**: 3 · **Project**: **ios-oc-uikit-mvvm** · **Toolkit**: iOS UIKit (ObjC++) · **Build**: Xcode · **What it shows**: Self-contained iOS Xcode project: an `IViewAdapter` over `UILabel`/`UITextField`/`UIButton` (Masonry layout), the same ViewModel on iPhone/iPad.
- **#**: 4 · **Project**: **web-mvvm** · **Toolkit**: Web (HTTP/REST/SSE) · **Build**: CMake (`ARIA_BUILD_HTTP=ON`) · **What it shows**: A C++ ViewModel exposed to the browser via `HttpAdapter` — SSE-pushed state + REST-driven commands, two-way binding, plus a vanilla-JS client (`aria_client.js`). Optional HTTPS.
- **#**: 5 · **Project**: **android-jni-mvvm** · **Toolkit**: Android (JNI + Compose/View) · **Build**: Gradle (NDK r26+) · **What it shows**: An Android Studio / Gradle project driving the same C++ ViewModel from Kotlin through the `aria-jni` adapter.

**Headless / console examples** (built with `ARIA_BUILD_EXAMPLES=ON`, no GUI):

### Project · What it shows
- **Project**: **inspector-demo** · **What it shows**: CLI reactive-graph flush tracer — prints the push/pull trace of a live graph (diagnostics / `TraceSink`).
- **Project**: **plugin-property-demo** · **What it shows**: Cross-dylib ABI smoke: a host exe + plugin shared library driving a `Property<T>` purely through the stable, non-template `aria::IProperty` interface across a DSO boundary. Runs as the `cross_dylib_abi_smoke` test.
- **Project**: **todomvc** · **What it shows**: Headless TodoMVC: `ObservableList` + two live `FilteredList` views (active/completed) + `Selection`, all reacting incrementally. Runs as the `todomvc_smoke` test.

Build & run example 1 (Qt):

```bash
cmake -S . -B build/flavors/qt-demo -DARIA_BUILD_QT6=ON
cmake --build build/flavors/qt-demo -j
./build/flavors/qt-demo/bin/ex_qt_showcase
```

Example 4 (web) needs the HTTP adapter; see
[`examples/4-web-mvvm/README.md`](examples/4-web-mvvm/) for run instructions:

```bash
cmake -S . -B build/flavors/web-demo -DARIA_BUILD_HTTP=ON
cmake --build build/flavors/web-demo --target example_4_web_mvvm
```

The headless examples build by default (`ARIA_BUILD_EXAMPLES=ON`) and run via
`ctest` (`cross_dylib_abi_smoke`, `todomvc_smoke`) or directly from
`build/flavors/<name>/bin/`.

Examples 2 and 3 are **not** part of the CMake tree — open the Xcode project
and hit Run; example 5 is an Android Studio / Gradle project (NDK r26+):

- [`examples/2-macos-appkit-mvvm/mac-oc-mvvm.xcodeproj`](examples/2-macos-appkit-mvvm/) — macOS AppKit
- [`examples/3-ios-oc-uikit-mvvm/ios-oc-mvvm.xcodeproj`](examples/3-ios-oc-uikit-mvvm/) — iOS UIKit
- [`examples/5-android-jni-mvvm/`](examples/5-android-jni-mvvm/) — Android (Gradle)

### Build options

### Option · Default · Description
- **Option**: `ARIA_BUILD_TESTS` · **Default**: ON · **Description**: Build unit tests + ctest registration.
- **Option**: `ARIA_BUILD_EXAMPLES` · **Default**: ON · **Description**: Build all examples (console + Qt6 when enabled).
- **Option**: `ARIA_BUILD_BENCHMARK` · **Default**: ON · **Description**: Build the micro-benchmark suite.
- **Option**: `ARIA_BUILD_SHARED` · **Default**: ON · **Description**: Runtime/binding as `.dylib`/`.so`/`.dll` instead of `.a`.
- **Option**: `ARIA_BUILD_QT6` · **Default**: OFF · **Description**: Build Qt6 adapter and GUI examples (requires `Qt6Widgets`).
- **Option**: `ARIA_BUILD_APPKIT` · **Default**: OFF · **Description**: **(production-grade)** macOS AppKit adapter as a first-class CMake module — built as `STATIC` + `.mm`, ships `aria::adapters::appkit`, passes the full `adapter_conformance` test battery. Requires `APPLE`. The standalone AppKit example in `examples/2-macos-appkit-mvvm/` now consumes this adapter via `BindingEngine::bind_text_oneway` / `bind_command`.
- **Option**: `ARIA_BUILD_UIKIT` · **Default**: OFF · **Description**: **(production-grade)** iOS UIKit adapter as a first-class CMake module — built as `STATIC` + `.mm`, ships `aria::adapters::uikit`, passes the in-app conformance battery (25/25 on iPhone 17 Pro Max). Requires `APPLE`. The standalone UIKit example in `examples/3-ios-oc-uikit-mvvm/` now consumes this adapter via `BindingEngine::bind_text_oneway` / `bind_command`.
- **Option**: `ARIA_BUILD_JNI` · **Default**: OFF · **Description**: Build Android JNI adapter as a first-class CMake module — built as `STATIC`, ships `aria::adapters::jni`, implementing the same `IViewAdapter` contract as Qt/AppKit/UIKit via reflective JNI dispatch (text / bool / int / double / visibility / click). Requires an Android NDK toolchain (**NDK r26+** — the C++20-concepts core does not build under NDK r25's libc++).
- **Option**: `ARIA_BUILD_WASM` · **Default**: OFF · **Description**: *(planned)* Build WebAssembly adapter.
- **Option**: `ARIA_ENABLE_ASAN` · **Default**: OFF · **Description**: AddressSanitizer.
- **Option**: `ARIA_ENABLE_UBSAN` · **Default**: OFF · **Description**: UndefinedBehaviorSanitizer.
- **Option**: `ARIA_ENABLE_TSAN` · **Default**: OFF · **Description**: ThreadSanitizer.

## Hello, world

```cpp
#include "aria/aria.hpp"
using namespace aria;

Property count{0};

// No explicit dependency list — every Property::get() inside the lambda
// is auto-tracked on first evaluation.
Computed<std::string> label([&]{
    return "count = " + std::to_string(count.get());
});

Command<> increment([&]{ count = count.get() + 1; });

auto sub = label.bind([](const std::string& s) { std::cout << s << '\n'; });

increment();   // → "count = 1"
increment();   // → "count = 2"
```

## Async (C++20 coroutines)

```cpp
#include "aria/async/task.hpp"
#include "aria/async/executor.hpp"
using namespace aria::async;

Task<std::string> fetch_user(int id) {
    co_await schedule_on(network_pool);     // jump to worker thread
    auto raw = http::get("/users/" + std::to_string(id));
    co_await schedule_on(main_dispatcher);   // jump back to UI thread
    co_return parse(raw);
}
```

## Cross-platform mapping

### Platform · UI host · Adapter
- **Platform**: Windows · **UI host**: Qt6 / WinUI · **Adapter**: `aria-qt6` ✅ ready (MSYS2 UCRT64 + MSVC 2022)
- **Platform**: macOS · **UI host**: AppKit / Qt6 · **Adapter**: `aria-qt6` ✅ ready; AppKit ✅ ready (example 2)
- **Platform**: Linux · **UI host**: Qt6 / GTK · **Adapter**: `aria-qt6` ✅ ready
- **Platform**: iOS · **UI host**: UIKit / SwiftUI bridge · **Adapter**: UIKit ✅ ready (example 3); `aria-uikit` module planned
- **Platform**: Android · **UI host**: Compose / View · **Adapter**: `aria-jni` ✅ ready (NDK r26+)
- **Platform**: **Web (server-driven)** · **UI host**: **HTML/JS in browser** · **Adapter**: **`aria-http` ✅ ready (REST + SSE; example 4)**
- **Platform**: Web (in-browser C++) · **UI host**: DOM via WASM · **Adapter**: `aria-wasm` planned

The HTTP adapter ships a small server (`HttpAdapter`) that exposes any
ViewModel over a JSON REST + Server-Sent-Events protocol, plus a
vanilla-JS browser SDK (`aria_client.js`). The server is built on the
vendored single-header **cpp-httplib** (HTTP/1.1 + SSE) and
**nlohmann::json** (encode/decode) — both committed under
`third_party/`, so the adapter adds no new external build dependency;
aria itself owns the wire protocol, view registry, subscription dispatch
and SSE fan-out. It is the right shape for
desktop apps that want a web UI on the side, headless services, and
local debug dashboards. The WASM adapter — which compiles C++ business
logic into the browser sandbox — solves a different, more constrained
problem and remains on the roadmap. See
[RFC 0001](docs/rfc/0001-http-adapter.md) for the design.

The **current release** ships the platform-agnostic core, runtime