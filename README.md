# Tab Tree

An (in development) file tree style tab sidebar.

Currently this plugin is missing many of the crucial features needed for version `1.0`, and contains some bugs, but is still usable as the most basic features have been implemented.

---

## To Do

Items which are marked as complete here but are still listed are those which have been fixed and will appear in next release (but are not in the current release).

Features:
- [ ] Close tab button which appears upon hover
- [ ] First class support for folders
- [ ] Re-arrange tabs by click and drag

Bugs:
- [ ] Fix issues with tabs mixing across windows
- [ ] Fix bug with favicon not showing when creating new tab from API

---

## Local Debugging

Open `about:debugging` in Firefox, then go to `This Firefox` on the left, and click `Load Temporary Add-on...`. Select the `manifest.json` file of the plugin in the file explorer.

Click `Reload` to update the plugin based on changes to the source.

---

## Disabling Top Tabs

Go to `about:config` from the address bar, and search for `toolkit.legacyUserProfileCustomizations.stylesheets` to set it to `true`.

Then go to the menu in the top right and select `Help` -> `More Troubleshooting Information`. On the table presented there should be a field called `Profile Directory`, click `Open Directory`.

Within this directory create folder called `chrome`, and then a file inside called `userChrome.css` containing the following:

```
#TabsToolbar {
    /* make the top toolbar hidden */
    visibility: collapse;
}
```

Then just restart Firefox and the tab toolbar will be gone. If you ever want to revert this change just remove the lines we just added from the file.

---

## Acknowledgements/Resources

- [An improvement of WebExtensions on Firefox 64 about implicit collaboration of addons](https://piro.sakura.ne.jp/latest/blosxom/mozilla/xul/2018-10-14_override-context-on-fx64.htm#topic2018-10-14_override-context-on-fx64)
- [Firefox Extensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
