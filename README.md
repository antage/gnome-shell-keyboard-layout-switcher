# keyboard-layout-switcher

If you want to use CapsLock and Shift+CapsLock, you should remap CapsLock to
Hyper (via Gnome Tweaks) and move Hyper to mod3 from mod4.

## Xorg

Create `$HOME/.Xmodmap`:

```
clear mod4
add mod4 = Super_L Super_R
add mod3 = Hyper_L
```

Logout and login, or run `xmodmap ~/.Xmodmap`.
