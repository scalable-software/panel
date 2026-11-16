# Panel — Requirements

## FEATURE: Window Panel

**Benefit** — Product teams get a window they can drop into a page: it holds the host
application's content under a bar with the window's controls, without the host application
building the window, or placing and wiring its controls, itself.

**Personas**

- **End user** — the person who sees the window and works with the content it holds.
- **Host application** — the application that embeds the window, places its content and its
  title in it, and acts on what it reports.

**In scope**

- Holding the content the host application places in the window, below a bar along its top.
- Bringing the bar with the window's controls — pin, minimize, maximize, restore and close —
  and showing only the controls that fit the window as it is now.
- Showing a title the host application places in the window, in the bar.

**Out of scope**

- Creating a window, removing it and adding it again while the page runs — the window is
  part of the page when the page loads.
- Stacking several windows, and deciding which one is in front.
- Remembering where a window was between visits.
- The content itself: the window neither listens to it nor changes it.

---

### STORY: Window with a Taskbar

As an **end user**, when I work with content in a window, I want its controls in a bar along
the top and the content below it, so that I always find the controls in the same place.

As a **host application**, I want to place my own content and a title in the window, so that
the window frames what I show.
