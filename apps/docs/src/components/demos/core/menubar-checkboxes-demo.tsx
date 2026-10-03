"use client";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@godui/components";
import { useState } from "react";

const keepOpen = (event: Event) => event.preventDefault();

export function MenubarCheckboxesDemo() {
  const [bookmarks, setBookmarks] = useState(false);
  const [fullUrls, setFullUrls] = useState(true);
  const [profile, setProfile] = useState("benoit");
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem
            checked={bookmarks}
            onCheckedChange={setBookmarks}
            onSelect={keepOpen}
          >
            Always Show Bookmarks Bar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={fullUrls}
            onCheckedChange={setFullUrls}
            onSelect={keepOpen}
          >
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>Toggle Fullscreen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={profile} onValueChange={setProfile}>
            <MenubarRadioItem value="andy" onSelect={keepOpen}>
              Andy
            </MenubarRadioItem>
            <MenubarRadioItem value="benoit" onSelect={keepOpen}>
              Benoit
            </MenubarRadioItem>
            <MenubarRadioItem value="luis" onSelect={keepOpen}>
              Luis
            </MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Add Profile...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
