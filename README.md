# keyboard-layout-switcher

This extension switch keyboard layout to #1 when pressing Hyper key,
and switch to layout #2 when pressing Shift+Hyper.

If you want to use CapsLock and Shift+CapsLock (or Ctrl and Shift+Ctrl), you should remap 
CapsLock (or Ctrl) to Hyper (via Gnome Tweaks: "Caps Lock behavior: Make Caps Lock an additional
Hyper" (or "Ctrl position: Caps Lock as Ctrl, Ctrl as Hyper").

## Xorg

In Xorg Hyper behaves like Super so you need move Hyper to mod3 from mod4.

Create `$HOME/.Xmodmap`:

```
clear mod4
add mod4 = Super_L Super_R
add mod3 = Hyper_L
```

Logout and login, or run `xmodmap ~/.Xmodmap`.
