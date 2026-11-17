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
- Hiding the window and showing it again, when the host application decides, with the
  window as it was.
- Pinning the window in place and unpinning it, by the end user or the host application,
  and reporting each change to the host application.
- Collapsing the window to its bar, where it sits, by the end user or the host application,
  and reporting it to the host application.
- Enlarging the window to fill the space it has, by the end user or the host application,
  and reporting it to the host application.
- Returning a collapsed or enlarged window to how it was, by the end user or the host
  application, and reporting it to the host application.
- Closing the window, by the end user or the host application: telling the host application,
  then removing the window from the page.
- Moving the window by dragging its bar, unless it is pinned or enlarged, and reporting its
  new position to the host application.
- Resizing the window with a grip at its lower right, while it is neither collapsed nor
  enlarged, and reporting its new dimensions to the host application.
- Consistency with the device colour theme.

**Out of scope**

- Creating a window while the page runs, and bringing back a window that was closed — the
  window is part of the page when the page loads.
- Stacking several windows, and deciding which one is in front.
- Keeping a window within the visible area: the end user may drag it partly out of view.
- Remembering where a window was between visits.
- Application-level theme switching; the window follows the device colour scheme only.
- The content itself: the window neither listens to it nor changes it.

---

### STORY: Window with a Taskbar

As an **end user**, when I work with content in a window, I want its controls in a bar along
the top and the content below it, so that I always find the controls in the same place.

As a **host application**, I want to place my own content and a title in the window, so that
the window frames what I show.

### STORY: Visibility Control

As a **host application**, when a window is not relevant to the current context, I want to
hide it and show it again later, so that the end user only sees windows that apply.

### STORY: Theme Compatibility

As an **end user**, I want the window to match my device's light or dark colour scheme, so
that it looks consistent with the rest of my interface.

### STORY: Pin and Unpin

As an **end user**, when a window is where I want it, I want to pin it in place and unpin it
later, so that I do not move it by accident.

As a **host application**, I want to be told whenever the window is pinned or unpinned, so
that I can act on it.

### STORY: Minimize

As an **end user**, when I do not need a window for a while, I want to collapse it to its
taskbar, so that it takes little room and stays within reach.

As a **host application**, I want to be told when the window is minimized, so that I can act
on it.

### STORY: Maximize

As an **end user**, when I want to focus on a window's content, I want to enlarge the window
to fill the space it has, so that I see as much as possible.

As a **host application**, I want to be told when the window is maximized, so that I can act
on it.

### STORY: Restore

As an **end user**, when a window is minimized or maximized, I want to return it to how it
was, so that I continue where I left off.

As a **host application**, I want to be told when the window is restored, so that I can act
on it.

### STORY: Close

As an **end user**, when I am done with a window, I want to close it, so that it no longer
takes room on my screen.

As a **host application**, I want to be told when the window closes, so that I can clean up
what belonged to it.

### STORY: Move

As an **end user**, I want to drag a window by its taskbar, so that I can place it where it
suits my work.

As a **host application**, I want to be told when the window has moved, so that I can act on
its new position.

### STORY: Resize

As an **end user**, I want to resize a window with a grip at its lower right, so that it
shows as much of the content as I need.

As a **host application**, I want to be told when the window has been resized, so that I can
act on its new dimensions.
